// Module imports
import fetchCityData from "./current_weather.js";
import getGeolocationWeather from "./geolocation.js";
import { getCurrentWeatherObj } from "./current_weather.js";

// Get user input
const searchBtn = document.querySelector("#submit");
const input = document.querySelector("#search-query");

searchBtn.addEventListener("click", () => {
  const input = document.querySelector("#search-query").value;
  //localStorage.setItem("input", input);
  fetchCityData(input);

  document.querySelector("#search-query").value = "";
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#submit").click();
  }
});


// Toggle celsius/fahrenheit
const toggleBtn = document.querySelector("#toggle-temp");

toggleBtn.addEventListener('click', () => {
  if (document.querySelector("#toggle-temp").textContent === "Fahrenheit") {
    document.querySelector("#toggle-temp").textContent = "Celsius";
  } else {
    document.querySelector("#toggle-temp").textContent = "Fahrenheit";
  }
  
  const input = getCurrentWeatherObj();
  const inputString = `${input.city}, ${input.country}`;
  fetchCityData(inputString);
});

// Set default landing page
const setDefault = document.querySelector("#set-default");

const addSetDefaultEventListener = () => {
  removeDefault();
  const input = getCurrentWeatherObj();
  const inputString = `${input.city}, ${input.country}`;
  localStorage.setItem("defaultStart", inputString);
};

setDefault.addEventListener("click", () => {
  // const input = localStorage.getItem("input");

  addSetDefaultEventListener();

  updateOptionsDropdown();
  //addRmDefaultEventListener();
});

const removeDefault = () => {
  localStorage.removeItem("defaultStart");
  console.log(getCurrentWeatherObj()); //testing
};

const updateOptionsDropdown = () => {
  document.querySelector(".dropdown-menu").replaceChildren();

  const template = `
  <li><a class="dropdown-item" href="#" id="set-default">Set as Default</a></li>
  <li><a class="dropdown-item" href="#" id="rm-default">Remove Default</a></li>`;

  document.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", template);
  
  const setDefault = document.querySelector("#set-default");

  setDefault.addEventListener("click", () => {
    addSetDefaultEventListener();
  });
};

const addRmDefaultEventListener = () => {
  const rmBtn = document.querySelector("#rm-default");

  rmBtn.removeEventListener("click", removeDefault);
  rmBtn.addEventListener("click", removeDefault);
};

// Local storage

if (localStorage.getItem("defaultStart") === null || localStorage.getItem("defaultStart") === "null") {
  getGeolocationWeather();
} else {
  updateOptionsDropdown();
  addRmDefaultEventListener();
  fetchCityData(localStorage.getItem("defaultStart"));
}