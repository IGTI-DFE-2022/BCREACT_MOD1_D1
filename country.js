import { getCountryData, getAllCountries } from './api.js';
import { dateToString, watchInputChanges, delay, formatLongInteger } from './util.js';

let startDateEl = document.querySelector('#data-inicio');
let endDateEl = document.querySelector('#data-fim');
let countryEl = document.querySelector('#pais');
let infoEl = document.querySelector('#dado');
let confirmedEl = document.querySelector('#stat-confirmed');
let deathEl = document.querySelector('#stat-deaths');
let recoveredEl = document.querySelector('#stat-recovered');

let topDeathsChart;

async function init() {
  let countryData = await getCountryData('brazil', '2022-01-01', '2022-01-31');
  addDailyDeaths(countryData);
  console.log({ countryData });
  await populateAllCountries();
  populateDados();
  setStartingData();
  // showStats(countryData);
  // showGraph(countryData, 'Deaths');
  await onFilterChanges();
  let delayedLoad = delay(onFilterChanges, 500);
  watchInputChanges(delayedLoad, startDateEl, endDateEl, countryEl, infoEl)
}

init();

function setStartingData() {
  let startOfYear = new Date(2022, 0, 1);
  startDateEl.value = dateToString(startOfYear);
  endDateEl.value = dateToString(new Date());
  countryEl.value = 'brazil';
  infoEl.value = 'Deaths'
}

function addDailyDeaths(countryData) {
  for (let i = 0; i < countryData.length; i++) {
    if (i == 0) {
      countryData[i].DailyDeaths = 0;
    } else {
      countryData[i].DailyDeaths = countryData[i].Deaths - countryData[i - 1].Deaths;
    }
  }
}

async function onFilterChanges() {
  console.log('calling onFilterChanges');
  let countryData = await getCountryData(countryEl.value, startDateEl.value, endDateEl.value);
  addDailyDeaths(countryData);
  showGraph(countryData, infoEl.value);
  showStats(countryData);
}

async function populateAllCountries() {
  let countries = await getAllCountries();
  countryEl.innerHTML = "";
  countries.sort((a, b) => a.Slug.localeCompare(b.Slug))
  countries.forEach(c => {
    let opt = document.createElement('option');
    opt.value = c.Slug;
    opt.innerText = c.Country;
    countryEl.appendChild(opt);
  })
}

function populateDados() {
  infoEl.innerHTML = "";
  let stats = ['Active', 'Confirmed', 'Deaths', 'Recovered', 'DailyDeaths']
  stats.sort();
  stats.forEach(c => {
    let opt = document.createElement('option');
    opt.value = c;
    opt.innerText = c;
    infoEl.appendChild(opt);
  });
}

function calculateAverage(countryData, stat) {
  let sum = 0;
  let amount = 0;
  for (let day of countryData) {
    sum += day[stat];
    amount += 1;
  }
  return (1.0 * sum) / amount;
}

function showStats(countryData) {
  let last = countryData[countryData.length - 1];
  confirmedEl.innerText = formatLongInteger(last.Confirmed);
  deathEl.innerText = formatLongInteger(last.Deaths);
  recoveredEl.innerText = formatLongInteger(last.Recovered);
}

function showGraph(countryData, stat) {
  if (topDeathsChart) {
    topDeathsChart.destroy();
  }

  let average = calculateAverage(countryData, stat);

  const data = {
    labels: countryData.map(c => c.Date.split("T")[0]),
    datasets: [
      {
        label: stat,
        data: countryData.map(c => c[stat]),
        backgroundColor: [
          "rgba(0, 0, 255, 0.2)"
        ],
        borderColor: [
          "rgb(0, 0, 255)"
        ],
        borderWidth: 1,
      },
      {
        label: 'Average',
        data: countryData.map(c => average),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)"
        ],
        borderColor: [
          "rgb(255, 99, 132)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      },
      responsive: true,
      maintainAspectRatio: false
    },
  };

  topDeathsChart = new Chart(
    document.getElementById('country-chart'),
    config
  );

}