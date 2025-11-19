const display = document.getElementById("display");
const acBtn = document.querySelector('button[onclick="ClearAll()"]');

let firstOperand = null;
let operator = null;
let lastOperator = null;
let lastOperand = null;
let overwrite = true; // start fresh like iOS

function format(num) {
  // iOS-like trimming: avoid long floats, show up to ~10 meaningful digits
  if (!isFinite(num)) return "Error";
  const str = String(num);
  if (str.includes("e")) return num.toString();
  const rounded = Math.round(num * 1e10) / 1e10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toString();
}

function setDisplay(val) {
  display.value = val;
  // toggle AC/C like iOS
  if (display.value !== "0") acBtn.textContent = "C";
  else acBtn.textContent = "AC";
}

function ClearAll() {
  // If there's a current entry, 'C' clears entry only; 'AC' clears all.
  if (acBtn.textContent === "C") {
    setDisplay("0");
    overwrite = true;
    return;
  }
  firstOperand = null;
  operator = null;
  lastOperator = null;
  lastOperand = null;
  overwrite = true;
  setDisplay("0");
}

function append(value) {
  if (!value) return;

  // digits
  if (/^\d$/.test(value)) {
    if (overwrite || display.value === "0") {
      setDisplay(value);
      overwrite = false;
    } else {
      setDisplay(display.value + value);
    }
    return;
  }

  // decimal
  if (value === ".") {
    if (overwrite) {
      setDisplay("0.");
      overwrite = false;
    } else if (!display.value.includes(".")) {
      setDisplay(display.value + ".");
    }
    return;
  }

  // sign toggle
  if (value === "+/-") {
    if (display.value === "0" || display.value === "Error") return;
    const flipped = -parseFloat(display.value);
    setDisplay(format(flipped));
    return;
  }

  // percent (iOS behavior: as a unary operator; if operator active, turn current into % of firstOperand)
  if (value === "%") {
    const current = parseFloat(display.value || "0");
    if (operator !== null && firstOperand !== null) {
      const percent = firstOperand * (current / 100);
      setDisplay(format(percent));
    } else {
      setDisplay(format(current / 100));
    }
    overwrite = true; // percent completes an entry
    return;
  }

  // operators
  if (["+", "-", "*", "/"].includes(value)) {
    const current = parseFloat(display.value || "0");

    if (firstOperand === null) {
      firstOperand = current;
    } else if (!overwrite && operator !== null) {
      // compute previous op first (chained ops)
      const result = operate(firstOperand, operator, current);
      setDisplay(format(result));
      firstOperand = result === "Error" ? null : result;
    }
    operator = value;
    overwrite = true;
    return;
  }
}

function calculate() {
  const current = parseFloat(display.value || "0");

  // Case 1: we have an active operator → do op with current
  if (operator !== null && firstOperand !== null) {
    const result = operate(firstOperand, operator, current);
    setDisplay(format(result));
    lastOperator = operator;
    lastOperand = current;
    firstOperand = (result === "Error") ? null : result;
    operator = null;
    overwrite = true;
    return;
  }

  // Case 2: repeat last operation when '=' pressed again (iOS behavior)
  if (lastOperator !== null && lastOperand !== null) {
    const base = parseFloat(display.value || "0");
    const result = operate(base, lastOperator, lastOperand);
    setDisplay(format(result));
    firstOperand = (result === "Error") ? null : result;
    overwrite = true;
  }
}

function operate(a, op, b) {
  if (!isFinite(a) || !isFinite(b)) return "Error";
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    default: return b; // fallback
  }
}

// Optional: simple keyboard support (numbers, ., operators, Enter, Backspace)
document.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/^\d$/.test(k)) return append(k);
  if (k === ".") return append(".");
  if (["+", "-", "*", "/"].includes(k)) return append(k);
  if (k === "Enter" || k === "=") return calculate();
  if (k === "%") return append("%");
  if (k.toLowerCase() === "c" && (e.ctrlKey || e.metaKey)) return ClearAll();
  if (k === "Escape") return ClearAll();
  if (k === "Backspace" && !overwrite) {
    if (display.value.length > 1) setDisplay(display.value.slice(0, -1));
    else setDisplay("0");
  }
});
