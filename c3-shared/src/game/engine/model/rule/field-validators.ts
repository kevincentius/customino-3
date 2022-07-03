
export function intRangeValidator(min: number, max: number) {
  return (value: number) => {
    if (value != Math.floor(value)) {
      return 'The value must be an integer / whole number.'
    }
    
    if (value < min || value > max) {
      return `The value must be between ${min} and ${max}.`;
    }
  }
}
