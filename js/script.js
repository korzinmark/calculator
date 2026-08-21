'use strict';

const calcGrid = document.querySelector('.calculator__grid');
const calcDisplay = document.querySelector('.calculator__display');
const clearBtn = document.querySelector('.btn--clear');
let result = 0;
let isFirstMinus = true;
let isPressedEqualBtn = false;

calcGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const key = btn.dataset.key;

    if (Number.isInteger(+key)) {
        if (clearBtn.textContent === 'AC') {
            clearBtn.textContent = 'C';
        }

        if (calcDisplay.textContent === '0') {
            calcDisplay.textContent = '';
        }

        calcDisplay.textContent += key;

    } else if (key === 'clear') {
        clearBtn.textContent = 'AC';
        calcDisplay.textContent = '0';
        result = 0;
        console.clear();

    } else if (key === 'add') {
        if (!calcDisplay.textContent.endsWith('+')) {
            const lastNumber = getLastNumber();
            const lastSign = getLastSign();

            if (lastSign === '+') {
                result += +lastNumber;
            } else if (lastSign === '-') {
                calcDisplay.textContent = calcDisplay.textContent.replace(/-$/, '+');

                if (isFirstMinus) {
                    result = +lastNumber;
                } else {
                    result -= +lastNumber;
                }
            } else {
                result += +lastNumber;
            }

            if (isPressedEqualBtn) {
                result = 0;
                isPressedEqualBtn = false;
            }

            calcDisplay.textContent += '+';

            console.log(result);
        }

    } else if (key === 'subtract') {
        if (!calcDisplay.textContent.endsWith('-')) {
            const lastNumber = getLastNumber();
            const lastSign = getLastSign();

            if (lastSign === '-') {
                if (isFirstMinus) {
                    result = +lastNumber;
                } else {
                    result -= +lastNumber;
                }
            } else if (lastSign === '+') {
                result += +lastNumber;
                calcDisplay.textContent = calcDisplay.textContent.replace(/\+$/, '-');
            } else {
                if (isFirstMinus) {
                    result = +lastNumber;
                } else {
                    result -= +lastNumber;
                }
            }

            if (isFirstMinus) {
                isFirstMinus = false;
            }

            calcDisplay.textContent += '-';

            console.log(result);
        }

    } else if (key === 'multiply') {
        if (!calcDisplay.textContent.endsWith('x')) {
            calcDisplay.textContent += '×';
        }

    } else if (key === 'equals') {
        const lastSign = getLastSign();
        const lastNumber = getLastNumber();

        if (lastSign === '+') {
            result += +lastNumber;
        } else if (lastSign === '-') {
            result -= +lastNumber;
        }

        calcDisplay.textContent = result;

        isPressedEqualBtn = true;
        isFirstMinus = true;

        console.log(result);
    }
});

function getLastNumber() {
    const match = calcDisplay.textContent.match(/\d+$/);
    const lastNumber = match ? match[0] : null;
    return lastNumber;
}

function getLastSign() {
    const lastSign = calcDisplay.textContent.match(/[-+*/]/g)?.at(-1) || null;
    return lastSign;
}