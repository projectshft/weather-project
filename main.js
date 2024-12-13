const apiKey = "6427275c4ee8b157888fdf144b2fc5ca";
const units = "imperial";

// Fetch current cocation to display default weather forecast.This returns an object in the form of {lat:____, lon:____}
const getCurrentLocation = () => {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lon: position.coords.longitude,
          lat: position.coords.latitude,
        });
      },
      (error) => reject(console.warn(`ERROR(${error.code}): ${error.message}`)),
      options
    );
  });
};

// Using the current location, fetch the appropriate weather data from OpenWeather API
const fetchCurrentLocationData = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=${units}`;

  const fetchedData = await fetch(url, {
    method: "GET",
    data: "json",
  });

  const currentLocationData = await fetchedData.json();

  return currentLocationData;
};

// Update HTML with current/default location weather data
const addCurrentLocation = async () => {
  try {
    const location = await getCurrentLocation();
    const locationData = await fetchCurrentLocationData(location);
    addNow(locationData);

    const fiveDayData = await fetchFiveDayData(location);
    const processedData = await processFiveDayData(fiveDayData);
    addFiveDay(processedData);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

addCurrentLocation();

// Use fetchNow() and addNow() functions to update the current weather forecast section of the HTML from a given locaiton query
const getNow = async () => {
  try {
    const nowData = await fetchNow();
    addNow(nowData);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

// Fetch current weatehr data for the location queried
const fetchNow = async () => {
  const query = document.querySelector("#query").value.replace(/\s+/g, "%20");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}$&limit=1&appid=${apiKey}&units=${units}`;

  const fetchedData = await fetch(url, {
    method: "Get",
    dataType: "json",
  });

  const nowData = await fetchedData.json();

  return nowData;
};

// Use template to update HTML for the current weather forecast based on data from the queried location
const addNow = async (data) => {
  const nowSection = document.querySelector("#now");
  nowSection.replaceChildren();

  const template = `      
    <div class="row justify-content-center forecast-today my-3" id="now">
      <div class="col-md-6">
        <h3 class="text-center">${data.main.temp.toFixed(1)}°</h3>
        <h4 class="text-center">${data.name}</h4>
        <h5 class="text-center">${data.weather[0].main}</h5>
      </div>
      <div class="col-md-6">
        <img
          class="img-fluid mx-auto d-block"
          src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" )
          alt="unable to load image"
        />
      </div>
    </div>
  `;

  nowSection.insertAdjacentHTML("beforeend", template);
};

// Use a series of functions to populate the 5-day forecast section of the HTML
const getFiveDay = async () => {
  try {
    const coordinates = await fetchCoordinates();
    const fiveDayData = await fetchFiveDayData(coordinates);
    const processedData = await processFiveDayData(fiveDayData);
    addFiveDay(processedData);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

// Use Open Weather Geolocation API to return data, {lat:____, lon:___}, for the queried location
const fetchCoordinates = async () => {
  const query = document.querySelector("#query").value.replace(/\s+/g, "%20");

  const coordinatesCall = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}
    `,
    {
      method: "GET",
      dataType: "json",
    }
  );

  const coordinatesArray = await coordinatesCall.json();
  const coordinates = coordinatesArray[0];

  return coordinates;
};

// Given an object with {lat:___, lon:___} syntax, fetch five-day weather information. This returns 40 instances of data which must be divided into 5 sets of 8.
const fetchFiveDayData = async (coordinates) => {
  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;

  const fetchFiveDay = await fetch(fiveDayURL, {
    method: "GET",
    dataType: "json",
  });

  const fiveDayData = await fetchFiveDay.json();

  return fiveDayData;
};

// Colate data from each day in the five-day forecast.
const processFiveDayData = async (data) => {
  const dividedDayData = [];

  const processDayData = (day) => {
    const indexRange = [(day - 1) * 8, day * 8 - 1];

    const getAvgTemp = () => {
      let acc = 0;
      let timeIndex = 0;

      for (let i = indexRange[0]; i <= indexRange[1]; i++) {
        const currentTemp = data.list[i].main.temp;
        acc += (currentTemp - acc) / (timeIndex + 1);
        timeIndex++;
      }

      return acc.toFixed(1);
    };

    const getSummaryIcon = () => {
      let icons = {};

      for (let i = indexRange[0]; i <= indexRange[1]; i++) {
        const icon = data.list[i].weather[0].icon;

        if (icons.hasOwnProperty(icon)) {
          icons[icon]++;
        } else {
          icons[icon] = 1;
        }
      }

      let iconMaxCount = 0;
      let iconSummary = "";

      for (let key in icons) {
        if (icons[key] > iconMaxCount) {
          iconMaxCount = icons[key];
          iconSummary = key;
        }
      }
      return iconSummary;
    };

    const getDayName = () => {
      const dt_txt = new Date(data.list[indexRange[0]].dt_txt);

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      });

      return dateFormatter.format(dt_txt);
    };

    const getSummaryWeatherDescription = () => {
      let dayData = {};
      let weatherDescriptions = {};

      for (let i = indexRange[0]; i <= indexRange[1]; i++) {
        const weatherDescription = data.list[i].weather[0].main;

        if (weatherDescriptions.hasOwnProperty(weatherDescription)) {
          weatherDescriptions[weatherDescription]++;
        } else {
          weatherDescriptions[weatherDescription] = 1;
        }
      }

      let weatherDescriptionsMaxCount = 0;
      let summaryDescription = "";

      for (let key in weatherDescriptions) {
        if (weatherDescriptions[key] > weatherDescriptionsMaxCount) {
          weatherDescriptionsMaxCount = weatherDescriptions[key];
          summaryDescription = key;
        }
      }
      return summaryDescription;
    };

    return {
      avgTemp: getAvgTemp(),
      iconSummary: getSummaryIcon(),
      weatherSummary: getSummaryWeatherDescription(),
      dayName: getDayName(),
    };
  };

  // Iterate through each day to colate all summary data
  for (let i = 1; i <= 5; i++) {
    dividedDayData.push(processDayData(i));
  }

  return dividedDayData;
};

// Update HTML with data given in the form returned by the processFiveDayData function
const addFiveDay = (summaryData) => {
  const fiveDaySection = document.querySelector(".forecast-5-day");
  fiveDaySection.replaceChildren();

  const dayTemplate = (summaryItem) => `
    <div class="col-md-2 container-fluid border justify-content-center" id="day-1">
      <div class="text-center mt-2">
        <p class="text-center m-0">${summaryItem.weatherSummary}
        </p>
        <p class="text-center m-0"><strong>${summaryItem.avgTemp}°</strong>
        </p>
        <img src="https://openweathermap.org/img/wn/${summaryItem.iconSummary}@2x.png" alt="" class="mx-auto">
        <h5 class="text-center m-2">${summaryItem.dayName}</h5>
      </div>
    </div>
    `;

  const allDaysTemplate = `
    <div class="row justify-content-center">
      <h2>Five Day Forecast</h2>
    </div>

    <div class="row justify-content-center my-2">
    ${summaryData.map((summaryItem) => dayTemplate(summaryItem)).join("")}
    </div>
      `;

  fiveDaySection.insertAdjacentHTML("beforeend", allDaysTemplate);
};

const searchButton = document.querySelector(".search");
searchButton.addEventListener("click", () => {
  getNow();
  getFiveDay();
  document.querySelector("#query").value = "";
});
