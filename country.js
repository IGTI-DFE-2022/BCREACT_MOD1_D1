import { getCountryData } from './api.js';
import { dateToString } from './util.js';

let startDateEl = document.querySelector('#data-inicio');
let endDateEl = document.querySelector('#data-fim');
let countryEl = document.querySelector('#pais');
let infoEl = document.querySelector('#dado');

async function init() {
  let countryData = await getCountryData('brazil', '2022-01-01', '2022-01-31');
  console.log({ countryData });
  setStartingData();
}

init();

function setStartingData() {
  let startOfYear = new Date(2022, 0, 1);
  startDateEl.value = dateToString(startOfYear);
  endDateEl.value = dateToString(new Date());
}
