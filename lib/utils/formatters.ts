const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
});

const monthFormatterShort = new Intl.DateTimeFormat('en', {
  month: 'short',
});

const monthFormatterLong = new Intl.DateTimeFormat('en', {
  month: 'long',
});

const tokenFormatters = {
  yyyy: (date: Date) => String(date.getFullYear()),
  yy: (date: Date) => String(date.getFullYear()).slice(-2),
  MMMM: (date: Date) => monthFormatterLong.format(date),
  MMM: (date: Date) => monthFormatterShort.format(date),
  MM: (date: Date) => String(date.getMonth() + 1).padStart(2, '0'),
  M: (date: Date) => String(date.getMonth() + 1),
  dd: (date: Date) => String(date.getDate()).padStart(2, '0'),
  d: (date: Date) => String(date.getDate()),
} as const;

const formatTokens = Object.keys(tokenFormatters).sort((left, right) => right.length - left.length);

const isValidDate = (date: Date): boolean => !Number.isNaN(date.getTime());

const formatWithPattern = (date: Date, pattern: string): string => {
  const tokenPattern = new RegExp(`(${formatTokens.join('|')})`, 'g');

  return pattern.replace(tokenPattern, (match) => tokenFormatters[match as keyof typeof tokenFormatters](date));
};

export function formatRelativeTime(date: string): string {
  const parsedDate = new Date(date);

  if (!isValidDate(parsedDate)) {
    return '';
  }

  const differenceInSeconds = Math.round((parsedDate.getTime() - Date.now()) / 1000);
  const absoluteDifference = Math.abs(differenceInSeconds);

  if (absoluteDifference < 60) {
    return relativeTimeFormatter.format(differenceInSeconds, 'second');
  }

  const differenceInMinutes = Math.round(differenceInSeconds / 60);
  if (Math.abs(differenceInMinutes) < 60) {
    return relativeTimeFormatter.format(differenceInMinutes, 'minute');
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);
  if (Math.abs(differenceInHours) < 24) {
    return relativeTimeFormatter.format(differenceInHours, 'hour');
  }

  const differenceInDays = Math.round(differenceInHours / 24);
  if (Math.abs(differenceInDays) < 30) {
    return relativeTimeFormatter.format(differenceInDays, 'day');
  }

  const differenceInMonths = Math.round(differenceInDays / 30);
  if (Math.abs(differenceInMonths) < 12) {
    return relativeTimeFormatter.format(differenceInMonths, 'month');
  }

  const differenceInYears = Math.round(differenceInMonths / 12);
  return relativeTimeFormatter.format(differenceInYears, 'year');
}

export function formatDate(date: string, format = 'MMM yyyy'): string {
  const parsedDate = new Date(date);

  if (!isValidDate(parsedDate)) {
    return '';
  }

  return formatWithPattern(parsedDate, format);
}

export function truncate(str: string, maxLength: number): string {
  if (maxLength <= 0) {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  if (maxLength <= 1) {
    return str.slice(0, maxLength);
  }

  return `${str.slice(0, maxLength - 1).trimEnd()}…`;
}

export function generateId(): string {
  return crypto.randomUUID();
}