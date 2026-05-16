export const differenceInYears = (date1: Date, date2: Date): number => {
  let years = date1.getFullYear() - date2.getFullYear();
  const m = date1.getMonth() - date2.getMonth();
  if (m < 0 || (m === 0 && date1.getDate() < date2.getDate())) years--;
  return years;
};
