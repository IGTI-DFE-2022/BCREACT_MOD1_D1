import { fetchJson } from "./util.js";

const baseUrl = "https://api.covid19api.com";
let globalStats = {};
let countriesStats = [];

export async function getStats() {
  let { Global, Countries } = await fetchJson(baseUrl + '/summary');
  globalStats = Global;
  countriesStats = Countries;
  return {global: Global, countries: Countries}
}

export function getTopCountries(allCountries, stat, amount = 10, order = 'desc') {
  let ord = order === 'desc' ? -1 : 1;
  return allCountries.sort((a, b) => ((a[stat] - b[stat]) * ord)).slice(0, amount);
}

export async function getCountryData(country, startDate, endDate) {
  let separator = startDate || endDate ? '?' : '';
  let url = `${baseUrl}/country/${country}${separator}`
  if (startDate) {
    url += `from=${startDate}`;
  }
  if (startDate && endDate) {
    url += `&`;
  }
  if (endDate) {
    url += `to=${endDate}`;
  }
  console.log({url})
  return fetchJson(url);
}

export function getAllCountries() {
  return fetchJson(baseUrl + "/countries")
}