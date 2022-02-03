import { getCountryData, getAllCountries } from './api.js';
import { dateToString } from './util.js';

let startDateEl = document.querySelector('#data-inicio');
let endDateEl = document.querySelector('#data-fim');
let countryEl = document.querySelector('#pais');
let infoEl = document.querySelector('#dado');

async function init() {
  let countryData = await getCountryData('brazil', '2022-01-01', '2022-01-31');
  console.log({ countryData });
  populateAllCountries();
  setStartingData();
  showGraph(countryData, 'Deaths');
}

init();

function setStartingData() {
  let startOfYear = new Date(2022, 0, 1);
  startDateEl.value = dateToString(startOfYear);
  endDateEl.value = dateToString(new Date());
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

function showGraph(countryData, stat) {
  const data = {
    labels: countryData.map(c => c.Date.split("T")[0]),
    datasets: [
      {
        label: stat,
        data: countryData.map(c => c[stat]),
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
          beginAtZero: false
        }
      },
      responsive: true,
      maintainAspectRatio: false
    },
  };

  const topDeathsChart = new Chart(
    document.getElementById('country-chart'),
    config
  );

}