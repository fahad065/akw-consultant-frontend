const dayjs = useDayjs();

export function formatNormalDate(d) {
  return dayjs(d).format('YYYY-MM-DD');
}

export function formatToCalendarDate(d) {
  return dayjs(d).format('MMMM DD YYYY');
}

export const formatDate = (d) => {
  return dayjs(d).format('DD-MM-YYYY');
}
