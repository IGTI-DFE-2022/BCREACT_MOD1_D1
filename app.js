const baseUrl = "https://api.covid19api.com";
let globalStats = {};
let countriesStats = [];

async function init() {
  let stats = await getStats();
  let topDeaths = getTopCountries(stats.countries, 'TotalDeaths', 10);
  let countryData = await getCountryData('brazil', '2022-01-01', '2022-01-31');
  showGlobalStats(stats.global);
  renderNewStatsChart(stats.global);
  renderTopCountryDeathsChart(stats.countries);
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
  let dateEl = document.querySelector('.stats-box .date');
  dateEl.innerText = globalStats.Date;

}

function renderNewStatsChart(globalStats) {
  const data = {
    labels: ['Confirmados', 'Recuperados', 'Mortes'],
    datasets: [{
      label: 'Distribuição de Novos Casos',
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      data: [globalStats.NewConfirmed, globalStats.NewRecovered, globalStats.NewDeaths],
    }]
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };

  const newChart = new Chart(
    document.getElementById('new-chart'),
    config
  );
}

function renderTopCountryDeathsChart(countriesStats) {
  let topDeaths = getTopCountries(countriesStats, 'TotalDeaths', 10);

  const data = {
    labels: topDeaths.map(c => c.Country),
    datasets: [
      {
        // label: topDeaths.map(c => c.Country),
        data: topDeaths.map(c => c.TotalDeaths),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    },
  };

  const topDeathsChart = new Chart(
    document.getElementById('countries-chart'),
    config
  );

}

function fetchJson(url, options) {
  return fetch(url, options).then(d => d.json());
}

function formatLongInteger(number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(number)
}