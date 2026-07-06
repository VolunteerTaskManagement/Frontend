export function toPersianDigits(value: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(value).replace(/[0-9]/g, (digit) => persianDigits[Number(digit)]);
}