window.onload = function () {
  addEventHandlerToNumbers();
  addEventHandlerToOperators();
  addEventHandlerToEqualsKey();
  addEventHandlerToClearKey();
  sessionStorage.clear();
};

function addEventHandlerToNumbers() {
  var keyButtonList = document.getElementsByClassName("num-key");
  for (var i = 0; i < keyButtonList.length; i++) {
    keyButtonList[i].addEventListener("click", addInputNumber, false);
  }
}

function addEventHandlerToOperators() {
  var operatorList = document.getElementsByClassName("operator-key");
  for (var i = 0; i < operatorList.length; i++) {
    operatorList[i].addEventListener("click", setOperator, false);
  }
}

function addEventHandlerToEqualsKey() {
  var equalsKey = document.getElementById("equal-key");
  equalsKey.addEventListener("click", performOperation, false);
}

function addEventHandlerToClearKey() {
  var clearKey = document.getElementById("clear-key");
  clearKey.addEventListener("click", clearSessionStorage, false);
}

function clearSessionStorage() {
  sessionStorage.clear();
  document.getElementById("displayValue").value = "0";
}

function addInputNumber(e) {
  var keyPressed = e.target.innerText;
  var currentDisplay = document.getElementById("displayValue").value;

  // If previous key pressed was =, this is a new operation.
  // Set display to key pressed and empty storage.
  if (sessionStorage.getItem("equalsKeyPressed") === "true") {
    document.getElementById("displayValue").value = keyPressed;
    sessionStorage.clear();
    return;
  }

  if (sessionStorage.getItem("input1") === null) {
    handleFirstInput(keyPressed, currentDisplay);
  } else {
    handleSecondInput(keyPressed, currentDisplay);
  }
}

function handleFirstInput(keyPressed, currentDisplay) {
  // If display is empty, enter input, else append to existing input
  if (currentDisplay === "0") {
    document.getElementById("displayValue").value = keyPressed;
  } else {
    document.getElementById("displayValue").value = currentDisplay + keyPressed;
  }
}

function handleSecondInput(keyPressed, currentDisplay) {
  // If the previous key pressed was that of an operator, the current input
  // must be that of the 2nd input operand, i.e. 5 in 4+5. The display at this point
  // either has input1 or digit/s of input 2.
  if (sessionStorage.getItem("operatorKeyPressed") === "true") {
    document.getElementById("displayValue").value = keyPressed;
    sessionStorage.setItem("operatorKeyPressed", "false");
  } else {
    // e.g. 6 in 76 is entered, so append 6 to 7
    document.getElementById("displayValue").value = currentDisplay + keyPressed;
  }
}

function setOperator(e) {
  var operator = e.target.innerText;

  if (sessionStorage.getItem("equalsKeyPressed") === "true") {
    sessionStorage.clear();
  }
  // If user erroneously presses 2 operators in a row, e.g. 5 + -,
  // only the last operator, -, should be considered, overwriting the previous
  // saved operator value in session storage.

  if (sessionStorage.getItem("operatorKeyPressed") === "true") {
    sessionStorage.setItem("operator", operator);
  } else {
    // In case of chain operation, complete the first and then do this,
    // i.e. 2+3-1, when user enters -, screen should display 5 without pressing =
    const input1 = sessionStorage.getItem("input1");
    if (input1 !== null) {
      performOperation();
      // Set equalsKeyPressed to false since the call to performOperation
      // from here is done without pressing =
      sessionStorage.setItem("equalsKeyPressed", "false");
    } else {
      setInput1ToDisplay();
    }

    const currentInput = document.getElementById("displayValue").value;
    sessionStorage.setItem("input1", currentInput);
    sessionStorage.setItem("operator", operator);
    sessionStorage.setItem("operatorKeyPressed", "true");
  }
}

function performOperation() {
  // User enter 2 + 3 =, gets 5, then presses = again, should show 5 + 3 = 8, then
  // 8 + 3 = 11, etc.
  if (sessionStorage.getItem("equalsKeyPressed") === "true") {
    setInput1ToDisplay();
  } else {
    sessionStorage.setItem(
      "input2",
      document.getElementById("displayValue").value
    );
  }
  sessionStorage.setItem("equalsKeyPressed", "true");
  document.getElementById("displayValue").value = calculateResult();
}

function setInput1ToDisplay() {
  sessionStorage.setItem(
    "input1",
    document.getElementById("displayValue").value
  );
}

function calculateResult() {
  var input1 = sessionStorage.getItem("input1");
  var input2 = sessionStorage.getItem("input2");
  var operator = sessionStorage.getItem("operator");
  switch (operator) {
    case "+":
      return (parseFloat(input1) + parseFloat(input2));
    case "-":
      return (parseFloat(input1) - parseFloat(input2));
    case "*":
      return (parseFloat(input1) * parseFloat(input2));
    case "/":
      return (parseFloat(input1) / parseFloat(input2));
    default:
      return "";
  }
}
