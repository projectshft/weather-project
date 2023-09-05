// Module imports
import fetchCityData from "./current_weather.js";
import getGeolocationWeather from "./geolocation.js";

if (!localStorage.getItem("defaultStart")) {
  getGeolocationWeather();
}

// Get user input
const searchBtn = document.querySelector("#submit");
const input = document.querySelector("#search-query");

searchBtn.addEventListener("click", () => {
  const input = document.querySelector("#search-query").value;
  localStorage.setItem("input", input);
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

  const input = localStorage.getItem("input");
  fetchCityData(input);
});
