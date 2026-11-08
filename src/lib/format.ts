const inrWhole = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const inrPaise = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });

// 12500 -> "₹12,500"   |   333.33 -> "₹333.33"
export const formatMoney = (amount: number) => {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? inrWhole.format(rounded) : inrPaise.format(rounded);
};

// "2026-11-08" -> "8 Nov 2026"
export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Today's date in the user's own timezone, as "YYYY-MM-DD".
export const todayISO = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
