export function zoneRateColor(rateName: string): string {
  switch (rateName) {
    case 'rate1':
      return '#66bb6a';
    case 'rate2':
      return '#ffee58';
    case 'rate3':
      return '#ff9800';
    case 'rate4':
      return '#f44336';
    default:
      return '#b0bec5';
  }
}
