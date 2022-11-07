let apiKey = "504b76049c23a98f2e402766465dad0d";

function fetchCoordinates(query) {
  $.get(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      query +
      "&APPID=" +
      apiKey,
    function (data) {
      if (data.length === 0) {
        renderError();
      }

      let lat = data[0].lat;
      let lon = data[0].lon;

      fetchCurrent(lat, lon);
      fetch5Day(lat, lon);
      getImageData(lat, lon, 32);
    }
  );
}

function fetchCurrent(lat, lon) {
  if (!lat || !lon) {
    renderError();
  }

  $.get(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&APPID=" +
      apiKey +
      "&units=imperial",
    function (data) {
      let compressedData = {};
      if (data.weather[0]) {
        compressedData = {
          condition: data.weather[0].main,
          temp: Math.round(data.main.temp),
          iconUrl:
            "http://openweathermap.org/img/wn/" +
            data.weather[0].icon +
            "@2x.png",
          location: data.name,
        };
        renderCurrentWeather(compressedData);
      } else {
        renderError();
      }
    }
  );
}

function fetch5Day(lat, lon) {
  if (!lat || !lon) {
    renderError();
  }

  $.get(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&APPID=" +
      apiKey +
      "&units=imperial",

    function (data) {
      if (data.list) {
        let days = [];
        for (let i = 0; i < data.list.length; i += 8) {
          //5 days from the 40 item long data.list
          days.push(data.list[i]);
        }

        let compressedData = [];
        days.forEach((day) => {
          let dayObj = {
            condition: day.weather[0].main,
            tempMin: Math.round(day.main.temp_min),
            tempMax: Math.round(day.main.temp_max),
            iconUrl:
              "http://openweathermap.org/img/wn/" +
              day.weather[0].icon +
              "@2x.png",
            day: getDayName(day.dt),
          };
          compressedData.push(dayObj);
        });
        render5DayWeather(compressedData);
      } else {
        renderError();
      }
    }
  );
}

function getDayName(unixTime) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let weekDayNum = new Date(unixTime * 1000).getDay();

  let day = days[weekDayNum];

  return day;
}
