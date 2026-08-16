'use strict';

const calcGrid = document.querySelector('.calculator__grid');
const calcDisplay = document.querySelector('.calculator__display');
const clearBtn = document.querySelector('.btn--clear');
let result = 0;

calcGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const key = btn.dataset.key;

    if (Number.isInteger(+key)) {
        clearBtn.textContent = 'C';

        if (calcDisplay.textContent === '0') {
            calcDisplay.textContent = '';
        }

        calcDisplay.textContent += key;

    } else if (key === 'clear') {
        clearBtn.textContent = 'AC';
        calcDisplay.textContent = '0';

    } else if (key === 'add') {
        if (!calcDisplay.textContent.endsWith('+')) {
            calcDisplay.textContent += '+';
            result += parseInt(calcDisplay.textContent);
            console.log(result);
        }
    }
});