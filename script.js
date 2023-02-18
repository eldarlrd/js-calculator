"use strict";
// Screen
const formula = document.getElementById("formula");
const display = document.getElementById("display");
// Keys
const numKeys = Array.from(document.getElementsByClassName("number"));
const operKeys = Array.from(document.getElementsByClassName("operator"));
const clrKey = document.getElementById("single-clear");
const allClrKey = document.getElementById("clear");
const eqlKey = document.getElementById("equals");
// Shorthand
const oneT = 1000000000000;
// Calculator
class Calculator {
  constructor(formula, display) {
    this.formula = formula;
    this.display = display;
    this.clearNext;
    this.allClear();
  }

  allClear() {
    this.prevOperand = "";
    this.operand = "0";
    this.operator = null;
  }

  clear() {
    if (this.clearNext) {
      this.clearNext = null;
      this.operand = "0";
    } if (isNaN(this.operand) || this.operand.match(/[E+]/g)) {
        this.operand = "0";
      } this.operand === "0"
          ? this.operand
          : this.operand = this.operand.toString().slice(0, -1);
  }

  append(num) {
    if (this.clearNext) {
      this.clearNext = null;
      this.operand = "0";
    } if (num === "." && this.operand.toString().includes(".")) {
        return;
      } this.operand = (this.operand.toString() + num.toString()).slice(0, 13);
  }

  operate(operator) {
    if (this.operand === "") {
      return;
    } if (this.prevOperand !== "") {
        this.calculate();
      }
    this.operator = operator.replace("*", "×").replace("/", "÷");
    this.prevOperand = this.operand;
    this.operand = "";
  }

  calculate() {
    const prev = +this.prevOperand;
    const curr = +this.operand;
    let result = 0;

    if (isNaN(prev) || isNaN(curr)) {
      return;
    } switch (this.operator) {
        case "+":
          result = prev + curr;
          break;
        case "-":
          result = prev - curr;
          break;
        case "×":
          result = prev * curr;
          break;
        case "÷":
          result = prev / curr;
          break;
        case "%":
          result = prev % curr;
      }
    if (result >= oneT || result <= -oneT) {
      this.operand = result.toExponential(5);
    } else if (!Number.isInteger(result)) {
        this.operand = +result.toFixed(6);
      } else this.operand = result;
    this.prevOperand = "";
    this.operator = null;
    this.clearNext = this.operand;
  }

  build(num) {
    const strNum = num.toString();
    const int = +strNum.split(".")[0];
    const dec = strNum.split(".")[1];
    let intText;

    if (isNaN(int)) {
      intText = "Undefined";
    } else {
        intText = int.toLocaleString("en", { maximumFractionDigits: 0 });
      } if (dec != null) {
          return `${intText}.${dec}`;
        } else return intText;
  }

  update() {
    this.display.innerText = this.build(this.operand);
    this.operator
      ? this.formula.innerText =
          `${this.build(this.prevOperand)} ${this.operator}`
      : this.formula.innerText = "";
  }
}

const calc = new Calculator(formula, display);
// Mouse
numKeys.forEach(key => {
  key.addEventListener("click", () => {
    calc.append(key.innerText);
    calc.update();
  })
})

operKeys.forEach(key => {
  key.addEventListener("click", () => {
    calc.operate(key.innerText);
    calc.update();
  })
})

clrKey.addEventListener("click", () => {
  calc.clear();
  calc.update();
})

allClrKey.addEventListener("click", () => {
  calc.allClear();
  calc.update();
})

eqlKey.addEventListener("click", () => {
  calc.calculate();
  calc.update();
})
// Keyboard
document.addEventListener("keydown", e => {
  const numPress = /\d/g;
  const operPress = /[+\-*/%]/g;
  if (e.key.match(numPress) || e.key === ".") {
    e.preventDefault();
    calc.append(e.key);
    calc.update();
  }
  if (e.key.match(operPress)) {
    e.preventDefault();
    calc.operate(e.key);
    calc.update();
  }
  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calc.calculate();
    calc.update();
  }
  if (e.key === "Backspace") {
    e.preventDefault();
    calc.clear();
    calc.update();
  }
  if (e.key === "Delete") {
    e.preventDefault();
    calc.allClear();
    calc.update();
  }
})