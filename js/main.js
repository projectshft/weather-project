// Module imports
import fetchCityData from "./current_weather.js";

// input (replace with user input later on...)

//const input = ["Fort Collins", "Denver", "Sydney", "London", "Kyiv", "Granby", "Pueblo", "Fort Carson"];

//fetchCityData(input[0]);

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
