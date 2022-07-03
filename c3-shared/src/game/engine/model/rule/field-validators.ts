
export function intRangeValidator(min: number, max: number) {
  return (value: number) => {
    if (value != Math.floor(value)) {
      return 'The value must be an integer / whole number.'
    }
    
    if (value < min || value > max) {
      return `The value must be between ${min} and ${max}.`;
    }

    return undefined;
  }
}

export function floatRangeValidator(min: number, max: number) {
  return (value: number) => {
    if (value < min || value > max) {
      return `The value must be between ${min} and ${max}.`;
    }

    return undefined;
  }
}

export function listValidator(itemValidator: (value: any) => string | undefined) {
  return (value: any[]) => {
    for (const item of value) {
      const error = itemValidator(item);
      if (error != undefined) {
        return error;
      }
    }

    return undefined;
  }
}
