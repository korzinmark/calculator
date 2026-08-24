'use strict';

const calcGrid = document.querySelector('.calculator__grid');
const calcDisplay = document.querySelector('.calculator__display');
const calcExpression = document.querySelector('.calculator__expression');
const clearBtn = document.querySelector('.btn--clear');

const MAX_DIGITS = 15;
const OPERATOR_KEY_BY_SYMBOL = { '+': 'add', '-': 'subtract', '×': 'multiply', '÷': 'divide' };

let tokens = [];
let currentOperand = '0';
let overwrite = true;
let justEvaluated = false;
let lastOperator = null;
let lastOperand = null;

calcGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    handleKey(btn.dataset.key);
});

document.addEventListener('keydown', (e) => {
    const key = KEY_MAP[e.key];
    if (!key) return;

    e.preventDefault();
    handleKey(key);
    flashKey(key);
});

const KEY_MAP = {
    '.': 'decimal',
    ',': 'decimal',
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    'x': 'multiply',
    'X': 'multiply',
    '/': 'divide',
    'Enter': 'equals',
    '=': 'equals',
    'Backspace': 'delete',
    'Escape': 'clear',
    'Delete': 'clear',
    '%': 'percent'
};

for (let i = 0; i <= 9; i += 1) {
    KEY_MAP[String(i)] = String(i);
}

function handleKey(key) {
    if (/^[0-9]$/.test(key)) {
        inputDigit(key);
        return;
    }

    switch (key) {
        case 'delete': deleteLast(); break;
        case 'clear': fullReset(); break;
        case 'percent': applyPercent(); break;
        case 'add': setOperator('+'); break;
        case 'subtract': setOperator('-'); break;
        case 'multiply': setOperator('×'); break;
        case 'divide': setOperator('÷'); break;
        case 'equals': equalsHandler(); break;
        case 'decimal': inputDecimal(); break;
        case 'negate': negate(); break;
        default: break;
    }
}

function inputDigit(digit) {
    if (currentOperand === 'Error') {
        fullReset();
    }

    if (overwrite) {
        currentOperand = digit === '0' ? '0' : digit;
        overwrite = false;

        if (justEvaluated) {
            tokens = [];
            justEvaluated = false;
        }

        clearOperatorHighlight();
    } else if (currentOperand === '0') {
        if (digit !== '0') {
            currentOperand = digit;
        }
    } else if (digitCount(currentOperand) < MAX_DIGITS) {
        currentOperand += digit;
    }

    render();
}

function inputDecimal() {
    if (currentOperand === 'Error') {
        fullReset();
    }

    if (overwrite) {
        currentOperand = '0.';
        overwrite = false;

        if (justEvaluated) {
            tokens = [];
            justEvaluated = false;
        }

        clearOperatorHighlight();
    } else if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }

    render();
}

function deleteLast() {
    if (currentOperand === 'Error') {
        fullReset();
        return;
    }

    if (overwrite) return;

    const trimmed = currentOperand.slice(0, -1);
    currentOperand = /^-?$/.test(trimmed) ? '0' : trimmed;

    render();
}

function fullReset() {
    tokens = [];
    currentOperand = '0';
    overwrite = true;
    justEvaluated = false;
    lastOperator = null;
    lastOperand = null;

    clearOperatorHighlight();
    render();
}

function applyPercent() {
    if (currentOperand === 'Error') return;

    const current = parseFloat(currentOperand);
    const pendingOperator = tokens[tokens.length - 1];
    let value;

    if ((pendingOperator === '+' || pendingOperator === '-') && tokens.length >= 2) {
        const base = parseFloat(tokens[tokens.length - 2]);
        value = (base * current) / 100;
    } else {
        value = current / 100;
    }

    currentOperand = String(cleanNumber(value));
    overwrite = true;

    render();
}

function setOperator(symbol) {
    if (currentOperand === 'Error') return;

    if (justEvaluated) {
        tokens = [currentOperand];
        justEvaluated = false;
    } else if (overwrite && tokens.length) {
        tokens[tokens.length - 1] = symbol;
        updateOperatorHighlight(symbol);
        render();
        return;
    } else {
        tokens.push(currentOperand);
    }

    tokens.push(symbol);
    overwrite = true;

    updateOperatorHighlight(symbol);
    render();
}

function negate() {
    if (currentOperand === 'Error' || currentOperand === '0') return;

    currentOperand = currentOperand.startsWith('-')
        ? currentOperand.slice(1)
        : `-${currentOperand}`;

    render();
}

function equalsHandler() {
    if (currentOperand === 'Error') return;

    let fullTokens;

    if (justEvaluated) {
        if (lastOperator === null || lastOperand === null) return;
        fullTokens = [currentOperand, lastOperator, lastOperand];
    } else if (tokens.length === 0) {
        return;
    } else {
        fullTokens = [...tokens, currentOperand];
    }

    const raw = evaluate(fullTokens);

    if (!Number.isFinite(raw)) {
        currentOperand = 'Error';
        tokens = [];
        lastOperator = null;
        lastOperand = null;
    } else {
        lastOperator = fullTokens[fullTokens.length - 2];
        lastOperand = fullTokens[fullTokens.length - 1];
        tokens = fullTokens;
        currentOperand = String(cleanNumber(raw));
    }

    overwrite = true;
    justEvaluated = true;

    clearOperatorHighlight();
    render();
}

function evaluate(tokenList) {
    const nums = [];
    const ops = [];

    tokenList.forEach((token, i) => {
        if (i % 2 === 0) {
            nums.push(parseFloat(token));
        } else {
            ops.push(token);
        }
    });

    for (let i = 0; i < ops.length;) {
        if (ops[i] === '×' || ops[i] === '÷') {
            if (ops[i] === '÷' && nums[i + 1] === 0) return NaN;

            const product = ops[i] === '×' ? nums[i] * nums[i + 1] : nums[i] / nums[i + 1];
            nums.splice(i, 2, product);
            ops.splice(i, 1);
        } else {
            i += 1;
        }
    }

    return ops.reduce((result, op, i) => (op === '+' ? result + nums[i + 1] : result - nums[i + 1]), nums[0]);
}

function cleanNumber(num) {
    if (!Number.isFinite(num) || Math.abs(num) >= 1e15) return num;

    const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
    return rounded === 0 ? 0 : rounded;
}

function render() {
    const displayValue = currentOperand === 'Error' ? 'Error' : formatNumber(currentOperand);

    calcDisplay.textContent = displayValue;
    calcExpression.textContent = tokens.length ? formatExpression(tokens, justEvaluated) : '';

    updateDisplaySize(currentOperand === 'Error' ? 0 : digitCount(currentOperand));

    clearBtn.textContent = (currentOperand !== '0' && currentOperand !== 'Error') || tokens.length
        ? 'C'
        : 'AC';
}

function updateDisplaySize(digits) {
    calcDisplay.classList.remove('calculator__display--compact', 'calculator__display--tiny');

    if (digits > 12) {
        calcDisplay.classList.add('calculator__display--tiny');
    } else if (digits > 8) {
        calcDisplay.classList.add('calculator__display--compact');
    }
}

function updateOperatorHighlight(symbol) {
    calcGrid.querySelectorAll('.btn--operator').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.key === OPERATOR_KEY_BY_SYMBOL[symbol]));
    });
}

function clearOperatorHighlight() {
    calcGrid.querySelectorAll('.btn--operator').forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
}

function flashKey(key) {
    const btn = calcGrid.querySelector(`[data-key="${key}"]`);
    if (!btn) return;

    btn.classList.add('is-pressed');
    window.setTimeout(() => btn.classList.remove('is-pressed'), 120);
}

function formatNumber(raw) {
    const negative = raw.startsWith('-');
    const unsigned = negative ? raw.slice(1) : raw;
    const dotIndex = unsigned.indexOf('.');
    const intPart = dotIndex === -1 ? unsigned : unsigned.slice(0, dotIndex);
    const decPart = dotIndex === -1 ? '' : unsigned.slice(dotIndex);
    const groupedInt = (intPart === '' ? '0' : intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (negative ? '-' : '') + groupedInt + decPart;
}

function formatExpression(tokenList, withEquals) {
    const parts = tokenList.map((token, i) => (i % 2 === 0 ? formatNumber(token) : token));
    return parts.join(' ') + (withEquals ? ' =' : '');
}

function digitCount(raw) {
    return raw.replace(/[^0-9]/g, '').length;
}
