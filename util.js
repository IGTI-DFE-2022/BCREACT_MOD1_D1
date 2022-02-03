export function fetchJson(url, options) {
  return fetch(url, options).then(d => d.json());
}

export function formatLongInteger(number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(number)
}

export function dateToString(date) {
  return date.toISOString().split("T")[0];
}