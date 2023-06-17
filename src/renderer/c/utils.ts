export function names(...v: string[]) {
  return v.filter((name) => Boolean(name)).join(' ');
}

export function check(result: boolean, className: string): string {
  return result ? className : '';
}

export function conditionalString(condition: any, value: string) {
  return condition ? value : '';
}

export function conditionalValue(condition: any, value: any) {
  return condition ? value : null;
}

export function buildLogSourceId(appId: string, instanceId: string) {
  return encodeURIComponent(`${appId}#${instanceId}`);
}

export function compareDateString(a: string, b: string): number {
  return Date.parse(a) - Date.parse(b);
}

export function parseDateStringToText(date: string): string {
  if (!date) {
    return 'unknown';
  }

  const now = new Date();
  const target = new Date(date);

  const yearDiff = now.getUTCFullYear() - target.getUTCFullYear();
  if (yearDiff > 0) {
    return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
  }

  const monthDiff = now.getUTCMonth() - target.getUTCMonth();
  if (monthDiff > 0) {
    return `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`;
  }

  const dayDiff = now.getUTCDate() - target.getUTCDate();
  if (dayDiff > 0) {
    return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
  }

  const hourDiff = now.getUTCHours() - target.getUTCHours();
  if (hourDiff > 0) {
    return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
  }

  const minuteDiff = now.getUTCMinutes() - target.getUTCMinutes();
  if (minuteDiff > 0) {
    return `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} ago`;
  }

  const secondDiff = now.getUTCSeconds() - target.getUTCSeconds();
  if (secondDiff > 0) {
    return `${secondDiff} second${secondDiff > 1 ? 's' : ''} ago`;
  }

  return 'just now';
}
