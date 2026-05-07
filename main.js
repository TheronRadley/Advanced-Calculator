/* ══════════════════════════════════════════
   CALC// — Advanced Calculator Logic
   ══════════════════════════════════════════ */

'use strict';

/* ─── STATE ─── */
const state = {
  display:      '0',
  expression:   '',
  operator:     null,
  operand:      null,
  waitingNext:  false,
  memory:       0,
  angleMode:    'deg',  // 'deg' | 'rad'
  mode:         'standard',
  pendingPowY:  false,
  history:      [],
};

/* ─── DOM REFS ─── */
const resultLine     = document.getElementById('resultLine');
const expressionLine = document.getElementById('expressionLine');
const memIndicator   = document.getElementById('memIndicator');
const angleIndicator = document.getElementById('angleIndicator');
const historyPanel   = document.getElementById('historyPanel');
const historyList    = document.getElementById('historyList');
const historyPop     = document.getElementById('historyPop');
const clearHistoryBtn= document.getElementById('clearHistory');

/* ─── MODES ─── */
const modePanels = {
  standard:   document.getElementById('modeStandard'),
  scientific: document.getElementById('modeScientific'),
  converter:  document.getElementById('modeConverter'),
};

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode;
    switchMode(mode);
  });
});

function switchMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === mode)
  );
  Object.entries(modePanels).forEach(([k, el]) =>
    el.classList.toggle('hidden', k !== mode)
  );
  resetCalc();
}

/* ─── DISPLAY ─── */
function updateDisplay() {
  const val = state.display;
  resultLine.textContent = formatNumber(val);
  resultLine.classList.toggle('shrink', val.length > 10);
  resultLine.classList.toggle('error', val === 'Error');
  expressionLine.textContent = state.expression;
}

function formatNumber(str) {
  if (str === 'Error' || str === 'Infinity' || str === '-Infinity') return str;
  if (str.includes('e')) return str; // scientific notation — keep raw
  const [int, dec] = str.split('.');
  const formatted = parseInt(int, 10).toLocaleString('en-US');
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function flashDisplay() {
  resultLine.classList.remove('flash');
  void resultLine.offsetWidth;
  resultLine.classList.add('flash');
}

/* ─── CALCULATOR CORE ─── */
function resetCalc() {
  state.display     = '0';
  state.expression  = '';
  state.operator    = null;
  state.operand     = null;
  state.waitingNext = false;
  state.pendingPowY = false;
  clearOpHighlight();
  updateDisplay();
}

function inputDigit(digit) {
  if (state.waitingNext) {
    state.display    = digit;
    state.waitingNext = false;
  } else {
    state.display = state.display === '0' ? digit : state.display + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (state.waitingNext) { state.display = '0.'; state.waitingNext = false; }
  else if (!state.display.includes('.')) state.display += '.';
  updateDisplay();
}

function inputOperator(op) {
  const current = parseFloat(state.display);

  if (state.operator && !state.waitingNext) {
    const result = compute(state.operand, current, state.operator);
    state.display   = String(result);
    state.operand   = result;
    state.expression = `${formatNumber(String(result))} ${opSymbol(op)}`;
    flashDisplay();
  } else {
    state.operand    = current;
    state.expression = `${formatNumber(state.display)} ${opSymbol(op)}`;
  }

  state.operator    = op;
  state.waitingNext = true;
  updateDisplay();
  highlightOp(op);
}

function equals() {
  if (state.operator === null) return;
  const current = parseFloat(state.display);
  const result  = compute(state.operand, current, state.operator);

  const histEntry = {
    expr:   `${state.expression} ${formatNumber(state.display)}`,
    result: formatNumber(String(result)),
  };
  addHistory(histEntry);

  state.expression  = `${state.expression} ${formatNumber(state.display)} =`;
  state.display     = String(result);
  state.operator    = null;
  state.operand     = null;
  state.waitingNext = true;
  clearOpHighlight();
  flashDisplay();
  updateDisplay();
}

function compute(a, b, op) {
  let result;
  switch (op) {
    case '+':   result = a + b; break;
    case '−':   result = a - b; break;
    case '×':   result = a * b; break;
    case '÷':   result = b === 0 ? 'Error' : a / b; break;
    case 'mod': result = a % b; break;
    case 'powY':result = Math.pow(a, b); break;
    default:    result = b;
  }
  if (result === 'Error') return 'Error';
  // avoid floating-point noise
  return parseFloat(result.toPrecision(12));
}

function opSymbol(op) {
  const map = { '+':'+', '−':'−', '×':'×', '÷':'÷', 'mod':'mod', 'powY':'^' };
  return map[op] || op;
}

function toggleSign() {
  if (state.display !== '0') {
    state.display = state.display.startsWith('-')
      ? state.display.slice(1)
      : '-' + state.display;
    updateDisplay();
  }
}

function percent() {
  const v = parseFloat(state.display);
  state.display = String(v / 100);
  updateDisplay();
}

function backspace() {
  if (state.display.length > 1 && state.display !== 'Error') {
    state.display = state.display.slice(0, -1);
  } else {
    state.display = '0';
  }
  updateDisplay();
}

/* ─── SCIENTIFIC ─── */
function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

function factorial(n) {
  n = Math.abs(Math.round(n));
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function sciFunction(fn) {
  const v = parseFloat(state.display);
  const isD = state.angleMode === 'deg';
  let result;

  switch (fn) {
    case 'sin':  result = Math.sin(isD ? toRad(v) : v); break;
    case 'cos':  result = Math.cos(isD ? toRad(v) : v); break;
    case 'tan':  result = Math.tan(isD ? toRad(v) : v); break;
    case 'asin': result = isD ? toDeg(Math.asin(v)) : Math.asin(v); break;
    case 'acos': result = isD ? toDeg(Math.acos(v)) : Math.acos(v); break;
    case 'atan': result = isD ? toDeg(Math.atan(v)) : Math.atan(v); break;
    case 'log':  result = Math.log10(v); break;
    case 'ln':   result = Math.log(v); break;
    case 'sqrt': result = Math.sqrt(v); break;
    case 'cbrt': result = Math.cbrt(v); break;
    case 'pow2': result = Math.pow(v, 2); break;
    case 'pow3': result = Math.pow(v, 3); break;
    case 'powY': state.pendingPowY = true; inputOperator('powY'); return;
    case 'inv':  result = 1 / v; break;
    case 'abs':  result = Math.abs(v); break;
    case 'fact': result = factorial(v); break;
    case 'pi':   result = Math.PI; break;
    case 'e':    result = Math.E; break;
    case 'EE':   // scientific notation entry
      state.display += 'e';
      updateDisplay(); return;
    default: return;
  }

  if (isNaN(result) || result === undefined) { state.display = 'Error'; }
  else { state.display = String(parseFloat(result.toPrecision(10))); }

  state.waitingNext = true;
  flashDisplay();
  updateDisplay();
}

function toggleAngle() {
  state.angleMode = state.angleMode === 'deg' ? 'rad' : 'deg';
  angleIndicator.textContent  = state.angleMode.toUpperCase();
  const btn = document.getElementById('angleToggle');
  if (btn) btn.textContent = state.angleMode.toUpperCase();
}

/* ─── MEMORY ─── */
function memClear()  { state.memory = 0; memIndicator.classList.add('hidden'); }
function memRecall() {
  state.display    = String(state.memory);
  state.waitingNext = true;
  updateDisplay();
}
function memAdd()    {
  state.memory += parseFloat(state.display);
  memIndicator.classList.remove('hidden');
}
function memSub()    {
  state.memory -= parseFloat(state.display);
  memIndicator.classList.remove('hidden');
}

/* ─── OPERATOR HIGHLIGHT ─── */
function highlightOp(op) {
  clearOpHighlight();
  document.querySelectorAll('.key.op').forEach(btn => {
    if (btn.dataset.value === op) btn.classList.add('selected');
  });
}
function clearOpHighlight() {
  document.querySelectorAll('.key.op.selected').forEach(b => b.classList.remove('selected'));
}

/* ─── PARENTHESES (sci) ─── */
function inputParen(p) {
  if (state.display === '0' || state.waitingNext) {
    state.display = p;
    state.waitingNext = false;
  } else {
    state.display += p;
  }
  updateDisplay();
}

/* ─── HISTORY ─── */
function addHistory(entry) {
  state.history.unshift(entry);
  if (state.history.length > 20) state.history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  state.history.forEach((h, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="h-expr">${h.expr}</div><div class="h-result">${h.result}</div>`;
    li.addEventListener('click', () => {
      state.display = h.result.replace(/,/g,'');
      state.waitingNext = true;
      updateDisplay();
    });
    historyList.appendChild(li);
  });
}

historyPop.addEventListener('click', () => {
  historyPanel.classList.toggle('hidden');
  historyPop.classList.toggle('active', !historyPanel.classList.contains('hidden'));
});

clearHistoryBtn.addEventListener('click', () => {
  state.history = [];
  renderHistory();
});

/* ─── BUTTON EVENTS ─── */
document.querySelectorAll('.key').forEach(btn => {
  btn.addEventListener('click', () => handleAction(btn));
});

function handleAction(btn) {
  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'digit':         inputDigit(value); break;
    case 'decimal':       inputDecimal(); break;
    case 'operator':      inputOperator(value); break;
    case 'equals':        equals(); break;
    case 'clear':         resetCalc(); break;
    case 'sign':          toggleSign(); break;
    case 'percent':       percent(); break;
    case 'backspace':     backspace(); break;
    case 'paren':         inputParen(value); break;
    case 'sci':           sciFunction(value); break;
    case 'toggle-angle':  toggleAngle(); break;
    case 'memory-clear':  memClear(); break;
    case 'memory-recall': memRecall(); break;
    case 'memory-add':    memAdd(); break;
    case 'memory-sub':    memSub(); break;
  }
}

/* ─── KEYBOARD SUPPORT ─── */
document.addEventListener('keydown', e => {
  if (state.mode === 'converter') return;
  const k = e.key;
  if (e.ctrlKey || e.metaKey) return;

  if (k >= '0' && k <= '9')        { inputDigit(k); return; }
  if (k === '.')                    { inputDecimal(); return; }
  if (k === '+')                    { inputOperator('+'); return; }
  if (k === '-')                    { inputOperator('−'); return; }
  if (k === '*')                    { inputOperator('×'); return; }
  if (k === '/')                    { e.preventDefault(); inputOperator('÷'); return; }
  if (k === '%')                    { percent(); return; }
  if (k === 'Enter' || k === '=')   { equals(); return; }
  if (k === 'Backspace')            { backspace(); return; }
  if (k === 'Escape')               { resetCalc(); return; }
  if (k === '(' || k === ')')       { inputParen(k); return; }
});

/* ══════════════════════════════════════════
   CONVERTER
   ══════════════════════════════════════════ */
const convData = {
  length: {
    units: ['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch','Nautical Mile'],
    toBase: [1, 1000, 0.01, 0.001, 1609.344, 0.9144, 0.3048, 0.0254, 1852],
  },
  weight: {
    units: ['Kilogram','Gram','Milligram','Pound','Ounce','Ton','Stone'],
    toBase: [1, 0.001, 0.000001, 0.453592, 0.0283495, 1000, 6.35029],
  },
  temp: {
    units: ['Celsius','Fahrenheit','Kelvin'],
    toBase: null, // special handling
  },
  area: {
    units: ['sq Meter','sq Kilometer','sq Mile','sq Yard','sq Foot','Hectare','Acre'],
    toBase: [1, 1e6, 2.59e6, 0.836127, 0.092903, 10000, 4046.86],
  },
  speed: {
    units: ['m/s','km/h','mph','knot','ft/s'],
    toBase: [1, 0.277778, 0.44704, 0.514444, 0.3048],
  },
};

let currentConv = 'length';

function populateConvSelects(type) {
  const data = convData[type];
  [document.getElementById('convFromUnit'), document.getElementById('convToUnit')].forEach((sel, i) => {
    sel.innerHTML = '';
    data.units.forEach((u, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = u;
      sel.appendChild(opt);
    });
    if (i === 1 && data.units.length > 1) sel.selectedIndex = 1;
  });
  doConvert();
}

function convertTemp(val, from, to) {
  let celsius;
  switch (from) {
    case 0: celsius = val; break;
    case 1: celsius = (val - 32) * 5 / 9; break;
    case 2: celsius = val - 273.15; break;
  }
  switch (to) {
    case 0: return celsius;
    case 1: return celsius * 9 / 5 + 32;
    case 2: return celsius + 273.15;
  }
}

function doConvert() {
  const data = convData[currentConv];
  const fromVal  = parseFloat(document.getElementById('convFrom').value) || 0;
  const fromIdx  = parseInt(document.getElementById('convFromUnit').value);
  const toIdx    = parseInt(document.getElementById('convToUnit').value);

  let result;
  if (currentConv === 'temp') {
    result = convertTemp(fromVal, fromIdx, toIdx);
  } else {
    const base = fromVal * data.toBase[fromIdx];
    result = base / data.toBase[toIdx];
  }

  document.getElementById('convTo').value =
    isNaN(result) ? '' : parseFloat(result.toPrecision(8));
}

document.querySelectorAll('.conv-type').forEach(btn => {
  btn.addEventListener('click', () => {
    currentConv = btn.dataset.conv;
    document.querySelectorAll('.conv-type').forEach(b => b.classList.toggle('active', b === btn));
    populateConvSelects(currentConv);
  });
});

document.getElementById('convFrom').addEventListener('input', doConvert);
document.getElementById('convFromUnit').addEventListener('change', doConvert);
document.getElementById('convToUnit').addEventListener('change', doConvert);

document.getElementById('convSwap').addEventListener('click', () => {
  const fu = document.getElementById('convFromUnit');
  const tu = document.getElementById('convToUnit');
  const fv = document.getElementById('convFrom');
  const tv = document.getElementById('convTo');
  const tmpIdx = fu.selectedIndex;
  fu.selectedIndex = tu.selectedIndex;
  tu.selectedIndex = tmpIdx;
  fv.value = tv.value;
  doConvert();
});

/* ─── INIT ─── */
populateConvSelects('length');
updateDisplay();
