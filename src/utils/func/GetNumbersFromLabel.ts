function getNumbersFromLabel(label: string): string {
    const regex = /\d+/g;
    const numbers = label.match(regex);
    return numbers ? numbers.join('') : '';
  }


  export default getNumbersFromLabel;