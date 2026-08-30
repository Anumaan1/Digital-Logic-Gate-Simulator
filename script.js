const gateDefinitions = {
  AND: { symbol: '&&', expression: 'A · B', description: 'The output is HIGH only when both inputs are HIGH.', calculate: (a, b) => a & b },
  OR: { symbol: '≥1', expression: 'A + B', description: 'The output is HIGH when at least one input is HIGH.', calculate: (a, b) => a | b },
  NOT: { symbol: '¬', expression: '¬A', description: 'The output is the inverse of input A.', calculate: (a) => a ? 0 : 1 },
  NAND: { symbol: '⊼', expression: '¬(A · B)', description: 'The output is LOW only when both inputs are HIGH.', calculate: (a, b) => (a & b) ? 0 : 1 },
  NOR: { symbol: '⊽', expression: '¬(A + B)', description: 'The output is HIGH only when both inputs are LOW.', calculate: (a, b) => (a | b) ? 0 : 1 },
  XOR: { symbol: '⊕', expression: 'A ⊕ B', description: 'The output is HIGH when the two inputs are different.', calculate: (a, b) => a ^ b },
  XNOR: { symbol: '⊙', expression: 'A ⊙ B', description: 'The output is HIGH when the two inputs are the same.', calculate: (a, b) => a === b ? 1 : 0 }
};

const state = { gate: 'AND', A: 0, B: 1 };
const gateButtons = document.querySelectorAll('.gate-button');
const bitButtons = document.querySelectorAll('.bit-toggle');
const gateTitle = document.querySelector('#gate-title');
const gateDescription = document.querySelector('#gate-description');
const expression = document.querySelector('#expression');
const gateVisual = document.querySelector('#gate-visual');
const outputValue = document.querySelector('#output-value');
const outputCaption = document.querySelector('#output-caption');
const circuitNote = document.querySelector('#circuit-note');
const tableBody = document.querySelector('#truth-table-body');
const inputBNode = document.querySelector('.input-b');

function calculateOutput(a, b) {
  return gateDefinitions[state.gate].calculate(a, b);
}

function renderTruthTable() {
  const rows = state.gate === 'NOT' ? [[0, null], [1, null]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
  tableBody.innerHTML = rows.map(([a, b]) => {
    const output = calculateOutput(a, b);
    const current = state.gate === 'NOT' ? state.A === a : state.A === a && state.B === b;
    return '<tr class="' + (current ? 'current' : '') + '"><td>' + a + '</td><td>' + (b === null ? '—' : b) + '</td><td>' + output + '</td></tr>';
  }).join('');
}

function render() {
  const gate = gateDefinitions[state.gate];
  const output = calculateOutput(state.A, state.B);
  gateTitle.textContent = state.gate + ' Gate';
  gateDescription.textContent = gate.description;
  expression.textContent = gate.expression;
  gateVisual.querySelector('.visual-symbol').textContent = gate.symbol;
  gateVisual.querySelector('.visual-label').textContent = state.gate;
  outputValue.textContent = output;
  outputValue.classList.toggle('high', output === 1);
  outputCaption.textContent = output === 1 ? 'HIGH' : 'LOW';
  inputBNode.style.visibility = state.gate === 'NOT' ? 'hidden' : 'visible';
  circuitNote.textContent = state.gate === 'NOT' ? 'Toggle input A to observe the inverted output.' : 'Toggle either input to observe the gate's output.';
  bitButtons.forEach((button) => {
    const value = state[button.dataset.input];
    button.textContent = value;
    button.setAttribute('aria-pressed', String(value === 1));
  });
  renderTruthTable();
}

gateButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.gate = button.dataset.gate;
    gateButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    render();
  });
});

bitButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const input = button.dataset.input;
    state[input] = state[input] === 1 ? 0 : 1;
    render();
  });
});

render();
