'use strict';

/**
 * @license AGPL-3.0-only
 * JS Calculator - A Digital Calculator
 * Copyright (C) 2023-2024 Eldar Pashazade <eldarlrd@pm.me>
 *
 * This file is part of JS Calculator.
 *
 * JS Calculator is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * JS Calculator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with JS Calculator. If not, see <https://www.gnu.org/licenses/>.
 */

// Screen Elements
const formula = document.getElementById('formula');
const display = document.getElementById('display');

// Keys
const numberKeys = Array.from(document.getElementsByClassName('number'));
const operandKeys = Array.from(document.getElementsByClassName('operator'));
const clearKey = document.getElementById('single-clear');
const allClearKey = document.getElementById('clear');
const equalsKey = document.getElementById('equals');

const ONE_TRILLION = 1e12;

class Calculator {
  constructor(formulaElement, displayElement) {
    this.formulaElement = formulaElement;
    this.displayElement = displayElement;
    this.clearNext = false;
    this.allClear();
  }

  allClear() {
    this.prevOperand = '';
    this.currOperand = '0';
    this.operator = null;
    this.clearNext = false;
    this.updateDisplay();
  }

  clear() {
    if (this.clearNext) {
      this.clearNext = false;
      this.currOperand = '0';
    }

    if (isNaN(this.currOperand) || this.currOperand.includes('E+'))
      this.currOperand = '0';

    this.currOperand =
      this.currOperand.length === 1 ? '0' : this.currOperand.slice(0, -1);

    this.updateDisplay();
  }

  appendNumber(num) {
    if (this.clearNext) {
      this.clearNext = false;
      this.currOperand = '0';
    }

    if (num === '.' && this.currOperand === '') this.currOperand = '0.';
    else if (num === '.' && this.currOperand.includes('.')) return;
    else
      this.currOperand = (this.currOperand.toString() + num.toString()).slice(
        0,
        13
      );

    this.updateDisplay();
  }

  chooseOperation(operator) {
    if (this.currOperand === '') return;

    if (this.prevOperand) this.calculate();

    // Replace for prettier signs
    this.operator = operator.replace('*', '×').replace('/', '÷');
    this.prevOperand = this.currOperand;
    this.currOperand = '';
    this.updateDisplay();
  }

  calculate() {
    const prev = +this.prevOperand;
    const curr = +this.currOperand;
    let result;

    if (isNaN(prev) || isNaN(curr)) return;

    switch (this.operator) {
      case '+':
        result = prev + curr;
        break;

      case '-':
        result = prev - curr;
        break;

      case '×':
        result = prev * curr;
        break;

      case '÷':
        result = prev / curr;
        break;

      case '%':
        result = prev % curr;
        break;

      default:
        return;
    }

    if (Math.abs(result) >= ONE_TRILLION)
      this.currOperand = result.toExponential(5);
    else
      this.currOperand =
        ~~result === result ? result.toString() : +result.toFixed(6);

    this.prevOperand = '';
    this.operator = null;
    this.clearNext = true;
    this.updateDisplay();
  }

  formatNumber(num) {
    if (isNaN(num)) return undefined;
    const [integer, decimal] = num.toString().split('.');

    const formattedInt = +integer.toLocaleString('en', {
      maximumFractionDigits: 0
    });

    return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt;
  }

  updateDisplay() {
    this.displayElement.innerText = this.formatNumber(this.currOperand);

    this.formulaElement.innerText =
      this.operator ?
        `${this.formatNumber(this.prevOperand)} ${this.operator}`
      : '';
  }
}

const calc = new Calculator(formula, display);

// Mouse
numberKeys.forEach(key => {
  key.addEventListener('click', () => {
    calc.appendNumber(key.innerText);
  });
});

operandKeys.forEach(key => {
  key.addEventListener('click', () => {
    calc.chooseOperation(key.innerText);
  });
});

clearKey.addEventListener('click', () => calc.clear());

allClearKey.addEventListener('click', () => calc.allClear());

equalsKey.addEventListener('click', () => calc.calculate());

// Keyboard
document.addEventListener('keydown', e => {
  const { key } = e;

  if (/^\d/.test(key) || key === '.') {
    e.preventDefault();
    calc.appendNumber(key);
  }

  if (/[+\-*/%]/.test(key)) {
    e.preventDefault();
    calc.chooseOperation(key);
  }

  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calc.calculate();
  }

  if (key === 'Backspace') {
    e.preventDefault();
    calc.clear();
  }

  if (key === 'Delete') {
    e.preventDefault();
    calc.allClear();
  }
});

// Easter Egg
console.log('"Obvious" is the most dangerous word in mathematics.');
