const baseUrl = "https://api.covid19api.com";
let globalStats = {};
let countriesStats = [];

async function init() {
  let stats = await getStats();
  let topDeaths = getTopCountries(stats.countries, 'TotalDeaths', 10);
  let countryData = await getCountryData('brazil', '2022-01-01', '2022-01-31');
  showGlobalStats(stats.global)
  console.log(stats)
}

init();

async function getStats() {
  let { Global, Countries } = await fetchJson(baseUrl + '/summary');
  globalStats = Global;
  countriesStats = Countries;
  return {global: Global, countries: Countries}
}

function getTopCountries(allCountries, stat, amount = 10, order = 'desc') {
  let ord = order === 'desc' ? -1 : 1;
  return allCountries.sort((a, b) => ((a[stat] - b[stat]) * ord)).slice(0, amount);
}

async function getCountryData(country, startDate, endDate) {
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

function showGlobalStats(globalStats) {
  let confirmedEl = document.querySelector('#total-confirmed');
  let deathEl = document.querySelector('#total-deaths');
  let recoveredEl = document.querySelector('#total-recovered');
  confirmedEl.innerText = formatLongInteger(globalStats.TotalConfirmed);
  deathEl.innerText = formatLongInteger(globalStats.TotalDeaths);
  recoveredEl.innerText = formatLongInteger(globalStats.TotalRecovered);
  let dateEl = document.querySelector('.stats .date');
  dateEl.innerText = globalStats.Date;

}

function fetchJson(url, options) {
  return fetch(url, options).then(d => d.json());
}

function formatLongInteger(number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(number)
}