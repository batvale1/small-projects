class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.isError = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
    this.isError = false;
    this.updateDisplay();
  }

  delete() {
    if (this.isError) return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (this.isError) return;
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (number === '-' && this.currentOperand.includes('-')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  square(degree) {
    if (this.isError) return;
    if (this.currentOperand < 0) {
      this.isError = true;
    }
    this.currentOperand = Math.pow(this.currentOperand, degree);
    this.previousOperand = '';
    this.operation = '';
  }

  chooseOperation(operation) {
    if (this.isError) return;
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '' && this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    if (this.isError) return;
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        const prevDecimalValue = prev.toString().split('.')[1];
        const curDecimalValue = prev.toString().split('.')[1];
        let accuracy = 0;
        if (prevDecimalValue) {
          accuracy = prevDecimalValue.toString().length;
        }
        if (curDecimalValue) {
          accuracy = Math.max(accuracy,curDecimalValue.toString().length);
        }

        computation = prev + current;

        if (accuracy) {
          computation = computation.toFixed(accuracy);
        }
        break
      case '-':
        computation = prev - current;
        break
      case '*':
        computation = prev * current;
        break
      case '÷':
        computation = prev / current;
        break
      case '^':
        computation = Math.pow(prev, current);
        break;
      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    if (this.isError) return;
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      if (number === '-') {
        integerDisplay = '-';
      } else {
        integerDisplay = '';
      }
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    if (this.isError) {
      this.currentOperandTextElement.innerText = 'Error. Please, reset :)';
      return;
    }
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const squareRootButton = document.querySelector('[data-squere-root]');
const minusButton = document.querySelector('[data-minus]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

      if(calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
  calculator.readyToReset) {
          calculator.currentOperand = "";
          calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay();
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    let textToShow = button.innerText;
    switch (textToShow) {
      case 'xy': textToShow = '^'; break;
    }
    calculator.chooseOperation(textToShow);
    calculator.updateDisplay();
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})

squareRootButton.addEventListener('click', button => {
  calculator.square(0.5);
  calculator.updateDisplay();
});

minusButton.addEventListener("click", button => {
  if (calculator.currentOperand === '') {
      if(calculator.previousOperand === "" &&
          calculator.currentOperand !== "" &&
          calculator.readyToReset) {
        calculator.currentOperand = "";
        calculator.readyToReset = false;
      }
      calculator.appendNumber(minusButton.innerText)
  }
  else {
      if (calculator.currentOperand === '-') return;
      calculator.chooseOperation(minusButton.innerText);
  }
  calculator.updateDisplay();
})