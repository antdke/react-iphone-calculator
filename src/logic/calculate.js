import operate from './operate'
import isNumber from './isNumber'
import Big from "big.js"

export default function calculate(obj, buttonName) {
  // When AC is pushed
  if (buttonName === "AC") {
    return {
        total: null,
        next: null,
        operation: null,
    }
  }

  // Conditions for different situations whenever a number pressed
  if (isNumber(buttonName)) {
      // 0 and any operation with 0 = 0
      if (buttonName === "0" && obj.next === "0") {
          return {}
      }

      // If there is an operation, update next
      if (obj.operation) {
        if (obj.next) {
            return { next: obj.next + buttonName }
        }
        return { next: buttonName }
      }

      // If there is no operation, update next and clear the value
      if (obj.next) {
        return {
          next: obj.next + buttonName,
          total: null,
        }
      }
      return {
        next: buttonName,
        total: null,
      }
  }

  // If "%" is pushed - I DONT REALLY UNDERSTAND THIS LOGIC
  if (buttonName === "%") {
    if (obj.operation &&  obj.next) {
      const result = operate(obj.total, obj.next, obj.operation)
      return {
        total: Big(result)
          .div(Big("100"))
          .toString(),
        next: null,
        operation: null,
      }
    }
    if (obj.next) {
      return {
        next: Big(obj.next)
          .div(Big(""))
          .toString(),
      }
    }
    return {}
  }

  // When "." is pushed
  if (buttonName === ".") {
    if (obj.next) {
      // ignore a . if the next number already has one
      if (obj.next.includes(".")) {
        return {};
      }
      return { next: obj.next + "." };
    }
    return { next: "0." };
  }

  if (buttonName === "=") {
    if (obj.next && obj.operation) {
      return {
        total: operate(obj.total, obj.next, obj.operation),
        next: null,
        operation: null,
      };
    } else {
      // '=' with no operation, nothing to do
      return {};
    }
  }

  if (buttonName === "+/-") {
    if (obj.next) {
      return { next: (-1 * parseFloat(obj.next)).toString() };
    }
    if (obj.total) {
      return { total: (-1 * parseFloat(obj.total)).toString() };
    }
    return {};
  }

  // Button must be an operation

  // When the user presses an operation button without having entered
  // a number first, do nothing.
  // if (!obj.next && !obj.total) {
  //   return {};
  // }

  // User pressed an operation button and there is an existing operation
  if (obj.operation) {
    return {
      total: operate(obj.total, obj.next, obj.operation),
      next: null,
      operation: buttonName,
    };
  }

  // no operation yet, but the user typed one

  // The user hasn't typed a number yet, just save the operation
  if (!obj.next) {
    return { operation: buttonName };
  }

  // save the operation and shift 'next' into 'total'
  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
}
