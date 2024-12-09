export const isValidEan13 = (ean: string): boolean => {
    // Vérifie que l'EAN contient exactement 13 caractères numériques
    if (!/^\d{13}$/.test(ean)) {
      return false;
    }
  
    // Extraire les 12 premiers chiffres et le dernier chiffre (clé de contrôle)
    const digits = ean.split("").map(Number);
    const checkDigit = digits[12]; 
  
    const weightedSum = digits.slice(0, 12).reduce((sum, digit, index) => {
      const weight = index % 2 === 0 ? 1 : 3;
      return sum + digit * weight;
    }, 0);
  
    // Calculer la clé de contrôle attendue
    const nearestTen = Math.ceil(weightedSum / 10) * 10;
    const calculatedCheckDigit = nearestTen - weightedSum;
  
    // Comparer la clé de contrôle calculée avec celle fournie
    return calculatedCheckDigit === checkDigit;
  };