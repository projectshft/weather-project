// Module imports
import fetchCityData from "./current_weather.js";
import getGeolocationWeather from "./geolocation.js";
import { getCurrentWeatherString } from "./current_weather.js";

// Retrieves user input
// Passes input to fetchCityData function

const searchBtn = document.querySelector("#submit");
const input = document.querySelector("#search-query");

searchBtn.addEventListener("click", () => {
  const input = document.querySelector("#search-query").value;
  fetchCityData(input);

  document.querySelector("#search-query").value = "";
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#submit").click();
  }
});


// Toggles celsius/fahrenheit

const toggleBtn = document.querySelector("#toggle-temp");

toggleBtn.addEventListener('click', () => {
  if (document.querySelector("#toggle-temp").textContent === "Fahrenheit") {
    document.querySelector("#toggle-temp").textContent = "Celsius";
  } else {
    document.querySelector("#toggle-temp").textContent = "Fahrenheit";
  }
  
  const input = getCurrentWeatherString();
  fetchCityData(input);
});

// Sets default landing page

const setDefault = document.querySelector("#set-default");

const clickSetDefault = () => {
  removeDefault();
  const input = getCurrentWeatherString();
  localStorage.setItem("defaultStart", input);
  alert(`Your default city is now ${input}`);
};

setDefault.addEventListener("click", () => {
  clickSetDefault();

  updateOptionsDropdown();
});

const removeDefault = () => {
  localStorage.removeItem("defaultStart");
};

const updateOptionsDropdown = () => {
  document.querySelector(".dropdown-menu").replaceChildren();

  const template = `
  <li><a class="dropdown-item" href="#" id="set-default">Set as Default</a></li>
  <li><a class="dropdown-item" href="#" id="rm-default">Remove Default</a></li>`;

  document.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", template);
  
  const setDefault = document.querySelector("#set-default");

  setDefault.addEventListener("click", () => {
    clickSetDefault();
  });
};

const addRmDefaultEventListener = () => {
  const rmBtn = document.querySelector("#rm-default");

  rmBtn.removeEventListener("click", removeDefault);
  rmBtn.addEventListener("click", removeDefault);
};

// Sets up default location each time the page is loaded

const pageLoad = () => {
  if (localStorage.getItem("defaultStart") === null || localStorage.getItem("defaultStart") === "null") {
    getGeolocationWeather();
  } else {
    updateOptionsDropdown();
    addRmDefaultEventListener();
    fetchCityData(localStorage.getItem("defaultStart"));
  }
};

pageLoad();