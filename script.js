// * capitalization of first letter function
function capitalizeFirstLetter(city) {
  if (!city) return ""; // Handle empty strings
  return city.charAt(0).toUpperCase() + city.slice(1);
}

// *  search  bar where city should go
let searchBar = document.querySelector(".search-bar");

// * search button
let searchButton = document.querySelector(".search-button");

// *  degree div. where degree info should go
let degree = document.querySelector(".degree");

// * Div where we are putting all weather text but, not the icon.
let weatherText = document.querySelector(".weather-text");

// * div where we are putting weather icon
let weatherIconDiv = document.querySelector(".weather-icon");

// * div where we are putting 5 day weather text
let fiveDayInfo = document.querySelector(".five-day-info");

// * div where we are putting 5 day weather icon
let fiveDayIcon = document.querySelector(".five-day-icon");

// * city weather info should go here
let cityWeatherInfoContainer = document.querySelector(".city-weather-info-container");

// * keydown listener listens for keys being pressed.
searchBar.addEventListener("keydown", function (event) {
  // * resets the page before searching for another
  weatherText.innerHTML = "";
  weatherIconDiv.innerHTML = "";
  if (event.key === "Enter") {
    searchButton.click();
  }
});

searchButton.addEventListener("click", function () {
  // * resets the page before searching for another
  weatherText.innerHTML = "";
  weatherIconDiv.innerHTML = "";
  // * we need to insert lan lon and api key I think

  // * value of what is typed in the search bar
  let city = searchBar.value;

  // * One Call API KEY
  let API_KEY = "6275bae3ce774562cbf599a7bd2d7ad9";

  // * Geocoding api call to get the lat and lon of the city we are searching
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`)
    .then((response) => response.json())

    .then((data) => {
      console.log(data[0]);

      // * latitude of city we searched
      let lat = data[0].lat;

      // * longitude of city we searched
      let lon = data[0].lon;

      // * url variable containing the full api url with lat / lon and api key variables interpolated.
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      fetch(url)
        .then((response) => response.json())

        .then((data) => {
          city = capitalizeFirstLetter(city);

          let weatherDegree = data.list[0].main.temp;

          let typeOfWeather = data.list[0].weather[0].main;

          let weatherIcon = data.list[0].weather[0].icon;

          let weatherIMG = document.createElement("img");
          weatherIMG.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

          weatherDegree = Math.round(weatherDegree);

          weatherText.innerHTML = `${weatherDegree}° <br> 
          ${city} <br>  ${typeOfWeather}`;

          weatherIconDiv.appendChild(weatherIMG);
        })

        .catch((error) => {
          console.log(error);
        });
      let fiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      fetch(fiveDay)
        .then((response) => response.json())
        .then((data) => {
          let newData = data.list.filter((x, index) => {
            return (index + 1) % 8 == 0;
          });
          console.log(data);
          console.log(newData);
          fiveDayInfo.innerHTML = "";
          newData.forEach((day) => {
            let timestamp = day.dt;

            let date = new Date(timestamp * 1000);

            let fiveDayString = date.toLocaleDateString("en-US", { weekday: "long" });

            console.log(fiveDayString); // e.g. "Sat"
            let fiveDayWeatherIcon = day.weather[0].icon;

            let fiveDayWeatherInfo = day.weather[0].main;

            let fiveDayWeatherDegree = day.main.temp;

            fiveDayWeatherDegree = Math.round(fiveDayWeatherDegree);

            let template = `<img src="https://openweathermap.org/img/wn/${fiveDayWeatherIcon}@2x.png">${fiveDayWeatherDegree}° 
             <br>  ${fiveDayWeatherInfo} ${fiveDayString}`;

            let forEachDiv = document.createElement("div");

            forEachDiv.innerHTML = template;
            fiveDayInfo.appendChild(forEachDiv);
          });

          // * // * this goes 1st forecast desc
          // * console.log(newData[0].weather[0].main);

          // * // * this goes 2nd number deg
          // * console.log(fiveDayWeatherDegree);

          // * // * this goes 3rd
          // * console.log(fiveDayWeatherIcon);

          // *

          // * fiveDayIcon.appendChild(fiveDayWeatherIMG);
        })
        .catch((error) => {
          console.error(error);
        });
    });
});
