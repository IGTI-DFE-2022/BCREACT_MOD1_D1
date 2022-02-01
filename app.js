const baseUrl = "https://api.covid19api.com";
let globalStats = {};
let countriesStats = [];

async function init() {
  let stats = await getStats();
  let topDeaths = getTopCountries(stats.countries, 'TotalDeaths', 10)
  console.log(topDeaths)
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

function fetchJson(url, options) {
  return fetch(url, options).then(d => d.json());
}
