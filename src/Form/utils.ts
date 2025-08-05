import type { Dayjs } from 'dayjs';

type Data = {
  month: Dayjs;
  percent: number;
  total: number;
};

export const getAmountByOnlyPercents = (data: Data) => {
  const { month, percent, total } = data;
  const daysInMont = month.daysInMonth();
  const daysInYear = month.isLeapYear() ? 366 : 365;

  const res = (total * (percent / 100) * daysInMont) / daysInYear;

  return res;
};
