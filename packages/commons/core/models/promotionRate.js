export function promotionRate(value) {
  return {
    value,
    toString() {
      return `${value}%`;
    },
  };
}
