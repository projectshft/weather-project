// Module imports
import fetchCityData from "./current_weather.js";

// Get user input
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
