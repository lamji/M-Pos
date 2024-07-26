/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Add delay to your app.
 * @param ms - Milliseconds
 */
export function timeout(ms: number | undefined = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Check if browser's windows is loaded. */
export const hasWindow = () => typeof window === 'object';

export function formatCurrency(amount: number): string {
  const res =
    '₱ ' + amount?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return res;
}

export const getTotal = (items: any) => {
  let total = 0;
  items.forEach((item: any) => {
    total += item.price * item.quantity;
  });
  return total;
};

export const generateRandomBarcode = (length: number): string => {
  const digits = '0123456789';
  let barcode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    barcode += digits[randomIndex];
  }
  return barcode;
};
