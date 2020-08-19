
window.onload = function() {
  sessionStorage.clear();
}

// Add event handler to number keys
const keyButtonList = document.getElementsByClassName('num-key');
for (let i = 0; i < keyButtonList.length; i++) {
  keyButtonList[i].addEventListener('click', addInputNumber, false);
}

// Add event handler to operator keys
const operatorList = document.getElementsByClassName('operator-key');
for (let i = 0; i < operatorList.length; i++) {
  operatorList[i].addEventListener('click', setOperator, false);
}

// Add event handler for equals sign
const equalsKey = document.getElementById('equal-key');
equalsKey.addEventListener('click', performOperation, false);

// Add event handler for clear key
const clearKey = document.getElementById('clear-key');
clearKey.addEventListener('click', clearSessionStorage, false);

function clearSessionStorage() {
  sessionStorage.clear();
  document.getElementById('displayValue').value = '0';
}

function addInputNumber(e) {
  const label = e.target.innerText;
  const currentInput = document.getElementById('displayValue').value;
  // If display is empty, enter input, else append to existing input

  if (sessionStorage.getItem('input1') === null) {
    if (currentInput === '0') {
      document.getElementById('displayValue').value = label;
    } else {
      document.getElementById('displayValue').value = currentInput + label;
    }
  } else {
    // If the previous key pressed was that of an operator, the current input
    // must be that of the 2nd input operand, i.e. 5 in 4+5.
    if (sessionStorage.getItem('operatorKeyPressed') === 'true') {
      document.getElementById('displayValue').value = label;
      sessionStorage.setItem('operatorKeyPressed', 'false');
    } else {
      document.getElementById('displayValue').value = currentInput + label;
    }
  }
}

function setOperator(e) {
  // In case of chain operation, complete the first and then do this,
  // i.e. 2+3-1, when user enters -, screen should display 5 without pressing =

  const input1 = sessionStorage.getItem('input1');
  if (input1 !== null)  {
    sessionStorage.setItem('input2', document.getElementById('displayValue').value);
    document.getElementById('displayValue').value = calculateResult();
    sessionStorage.clear();
  } else {
    sessionStorage.setItem('input1', document.getElementById('displayValue').value);
  }

  const operator = e.target.innerText;
  const currentInput = document.getElementById('displayValue').value;
  sessionStorage.setItem('input1', currentInput);
  sessionStorage.setItem('operator', operator);
  sessionStorage.setItem('operatorKeyPressed', 'true');
}

function performOperation() {
  sessionStorage.setItem('input2', document.getElementById('displayValue').value);
  document.getElementById('displayValue').value = calculateResult();
  sessionStorage.clear();
}

function calculateResult() {
  const input1 = sessionStorage.getItem('input1');
  const input2 = sessionStorage.getItem('input2');
  const operator = sessionStorage.getItem('operator');
  let result = '';
  if (operator === '+') {
    result = parseFloat(input1) + parseFloat(input2);
  } else if (operator === '-') {
    result = parseFloat(input1) - parseFloat(input2);
  } else if (operator === '*') {
    result = parseFloat(input1) * parseFloat(input2);
  } else if (operator === '/') {
    result = parseFloat(input1) / parseFloat(input2);
  }
  return result;
}


