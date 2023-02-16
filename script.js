// Display
const prevElem = document.getElementById("formula");
const elem = document.getElementById("display");
// Keys
const numKeys = Array.from(document.getElementsByClassName("number"));
const operKeys = Array.from(document.getElementsByClassName("operator"));
const clrKey = document.getElementById("single-clear");
const allClrKey = document.getElementById("clear");
const eqlKey = document.getElementById("equals");
// Calculator
class Calculator {
  constructor(prevElem, elem) {
    this.prevElem = prevElem;
    this.elem = elem;
    this.allClear();
  }

  allClear() {
    this.prevOper = "";
    this.oper = "0";
    this.operator = undefined;
  }

  clear() {
    this.oper === "0"
      ? this.oper
      : this.oper = this.oper.toString().slice(0, -1);
  }

  append(num) {
    if (num === "." && this.oper.includes(".")) {
      return;
    } this.oper = this.oper.toString() + num.toString();
  }

  operate(operator) {
    if (this.oper === "") {
      return;
    } if (this.prevOper !== "") {
      this.calculate();
    }
    this.operator = operator;
    this.prevOper = this.oper;
    this.oper = "0";
  }

  calculate() {
    const prev = parseFloat(this.prevOper);
    const curr = parseFloat(this.oper);
    let result;

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
    this.oper = Math.round(result * 1e4) / 1e4;
    this.prevOper = "";
    this.operator = undefined;
  }

  getNum(num) {
    const strNum = num.toString();
    const int = parseFloat(strNum.split(".")[0]);
    const dec = strNum.split(".")[1];
    let intText;

    if (isNaN(int)) {
      intText = "";
    } else {
      intText = int.toLocaleString("en", { maximumFractionDigits: 0 });
    } if (dec != null) {
        return `${intText}.${dec}`;
    } else return intText;
  }

  update() {
    this.elem.innerText = this.getNum(this.oper);
    this.operator != null
      ? this.prevElem.innerText =
          `${this.operator} ${this.getNum(this.prevOper)}`
      : this.prevElem.innerText = "";
  }
}

const calc = new Calculator(prevElem, elem);
// Calls
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