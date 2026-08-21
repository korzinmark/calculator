'use strict';

const calcGrid = document.querySelector('.calculator__grid');
const calcDisplay = document.querySelector('.calculator__display');
const clearBtn = document.querySelector('.btn--clear');
let result = 0;
let isFirstNumber = true;
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

        if (isPressedEqualBtn) {
            calcDisplay.textContent = '';
            isPressedEqualBtn = false;
        }

        calcDisplay.textContent += key;

    } else if (key === 'delete') {
        if (calcDisplay.textContent !== '0') {
            if (calcDisplay.textContent.length === 1) {
                calcDisplay.textContent = '0';
            } else {
                calcDisplay.textContent = calcDisplay.textContent.slice(0, -1);
            }
        }

    } else if (key === 'clear') {
        clearBtn.textContent = 'AC';
        calcDisplay.textContent = '0';
        result = 0;
        isFirstNumber = true;
        isPressedEqualBtn = false;

        console.clear();

    } else if (key === 'percent') {
        if (!calcDisplay.textContent.endsWith('%')) {
            calcDisplay.textContent += '%';
        } else {
            calcDisplay.textContent = `(${calcDisplay.textContent})%`;   
        }
    } else if (key === 'add') {
        if (!calcDisplay.textContent.endsWith('+')) {
            const lastNumber = getLastNumber();
            const lastSign = getLastSign();

            if (isPressedEqualBtn) {
                result = 0;
                isPressedEqualBtn = false;
            }

            if (lastSign === '+') {
                result += +lastNumber;
            } else if (lastSign === '-') {
                calcDisplay.textContent = calcDisplay.textContent.replace(/-$/, '+');

                if (isFirstNumber) {
                    result = +lastNumber;
                    isFirstNumber = false;
                } else {
                    result -= +lastNumber;
                }
            } else {
                result += +lastNumber;
            }

            calcDisplay.textContent += '+';

            console.log('isFirstNumber', isFirstNumber);
            console.log('lastNumber', lastNumber);
            console.log('result', result);
        }

    } else if (key === 'subtract') {
        if (!calcDisplay.textContent.endsWith('-')) {
            const lastNumber = getLastNumber();
            const lastSign = getLastSign();

            if (lastSign === '-') {
                if (isFirstNumber) {
                    result = +lastNumber;
                } else {
                    result -= +lastNumber;
                }
            } else if (lastSign === '+') {
                result += +lastNumber;
                calcDisplay.textContent = calcDisplay.textContent.replace(/\+$/, '-');
            } else {
                if (isFirstNumber) {
                    result = +lastNumber;
                } else {
                    result -= +lastNumber;
                }
            }

            if (isFirstNumber) {
                isFirstNumber = false;
            }

            calcDisplay.textContent += '-';

            console.log('isFirstNumber', isFirstNumber);
            console.log('result', result);
            console.log('lastNumber', lastNumber);
        }

    } else if (key === 'multiply') {
        if (!calcDisplay.textContent.endsWith('×')) {
            const lastSign = getLastSign();
            const lastNumber = getLastNumber();

            if (lastSign === '+') {
                if (isFirstNumber) {
                    result = +lastNumber;
                } else {
                    result += +lastNumber;
                }
            } else {
                if (isFirstNumber) {
                    result = +lastNumber;
                } else {
                    result *= +lastNumber;
                }
            }

            if (isFirstNumber) {
                isFirstNumber = false;
            }

            if (isPressedEqualBtn) {
                isPressedEqualBtn = false;
            }

            calcDisplay.textContent += '×';

            console.log('isFirstNumber', isFirstNumber);
            console.log('lastNumber', lastNumber);
            console.log('result', result);
        }

    } else if (key === 'divide') {
        if (!calcDisplay.textContent.endsWith('÷')) {
            const lastNumber = getLastNumber();

            if (isFirstNumber) {
                result = +lastNumber;
            } else {
                result /= +lastNumber;
            }

            if (isFirstNumber) {
                isFirstNumber = false;
            }

            calcDisplay.textContent += '÷';

            console.log('isFirstNumber', isFirstNumber);
            console.log('lastNumber', lastNumber);
            console.log('result', result);
        }

    } else if (key === 'equals') {
        const lastSign = getLastSign();
        const lastNumber = getLastNumber();

        if (lastSign === '+') {
            result += +lastNumber;
        } else if (lastSign === '-') {
            result -= +lastNumber;
        } else if (lastSign === '×') {
            result *= +lastNumber;
        } else if (lastSign === '÷') {
            result /= +lastNumber;
        }

        calcDisplay.textContent = result;

        isPressedEqualBtn = true;
        isFirstNumber = true;

        console.log('isFirstNumber', isFirstNumber);
        console.log('lastNumber', lastNumber);
        console.log('result', result);
    } else if (key === 'decimal') {
        const parts = calcDisplay.textContent.split(/[-+×÷]/);
        const lastPart = parts[parts.length - 1];

        if (!lastPart.includes('.')) {
            calcDisplay.textContent += '.';
        }

    } else if (key === 'negate') {
        if (calcDisplay.textContent.includes('(-')) {
            calcDisplay.textContent = calcDisplay.textContent.replace(/\D/g, '');

        } else if (calcDisplay.textContent !== '0') {
            calcDisplay.textContent = `(-${calcDisplay.textContent})`;
        }
    }
});

function getLastNumber() {
    const match = calcDisplay.textContent.match(/\d+$/);
    const lastNumber = match ? match[0] : null;
    return lastNumber;
}

function getLastSign() {
    const lastSign = calcDisplay.textContent.match(/[-+×÷]/g)?.at(-1) || null;
    return lastSign;
}