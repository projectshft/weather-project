const weather = {};


const fetchWeather = (location) => {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=2c3eee9a3a25a11d84225881a55ff923`,
    dataType: "json",
    success: function (data) {
      weather.currentWeather = data;
      fetchAddress(data.coord.lat, data.coord.lon);
      fetchForecast(data.coord.lat, data.coord.lon);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

const fetchForecast = (lat, lon) => {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=2c3eee9a3a25a11d84225881a55ff923`,
    dataType: "json",
    success: function (data) {
      weather.forecast = data.list;
      renderForecast();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// const fetchWeatherIcon = (code) => {
//   $.ajax({
//     method: "GET",
//     url: `http://openweathermap.org/img/wn/${code}@2x.png`,
//     dataType: "json",
//     success: function(data) {
//       return data;

//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     }
//   });
// }

const renderLocationWeather = () => {
  $('#weather').empty();

  const currentTempFahrenheit = (Math.round(weather.currentWeather.main.temp * 9 / 5 - 459.67)).toString();
  const currentLocation = weather.currentWeather.name;
  const locationState = weather.currentWeather.address.split(', ')[1];
  const conditions = weather.currentWeather.weather[0].main;
  const iconURL = `http://openweathermap.org/img/wn/${weather.currentWeather.weather[0].icon}@2x.png`

  $('#weather').append(`<h2>${currentTempFahrenheit}&#xb0</h2>`);
  $('#weather').append(`<span>${currentLocation}, ${locationState}<img src=${iconURL}></span>`);
  $('#weather').append(`<h4>${conditions}</h4>`);



}

const renderForecast = () => {
  const forecastArr = weather.forecast;

  const dateObj = forecastArr.reduce((acc, date) => {
    const weekday = moment(date.dt_txt).toString().substr(0, 3);
    if (acc[weekday]) {
      acc[weekday].temp.push(date.main.temp);
      acc[weekday].weather.push(date.weather[0].main);
      acc[weekday].icon.push(date.weather[0].icon);
    }
    else acc[weekday] = { temp: [date.main.temp], weather: [date.weather[0].main], icon: [date.weather[0].icon] };
    return acc;
  }, {})

  const finalStats = aggregateDayForecastData(dateObj);
  console.log(finalStats)

  // render final stats
  $('#forecast').empty();

  for (let dayObj in finalStats) {
    console.log(dayObj)
    const currentDay = moment().toString().substr(0, 3);
    let day = finalStats[dayObj];

    if (day.day !== currentDay) {
      console.log(`Object day: ${day.day}  Moment day: ${currentDay}`);
      const source = $('#forecast-template').html(); // turns handlebars template into string
      const template = Handlebars.compile(source);
      console.log(source)
      console.log(template)
      const forecastHTML = template(day);

      $('#forecast').append(forecastHTML);
    }
  }


}

const aggregateDayForecastData = (dateObj) => {
  const dateFinalStats = {};
  console.log(dateObj)

  for (let day in dateObj) {
    let dayObj = dateObj[day];
    let tempsArr = dayObj.temp;
    let conditionsArr = dayObj.weather;
    let iconArr = dayObj.icon;

    // get the most frequent condition for the forecast day
    const getMostFrequentCondition = (conditionsArr) => {
      let mostFrequentConditionCount = 0, mostFrequentCondition = '';

      let accumulatedConditions = conditionsArr.reduce((acc, item) => {
        if (acc[item])++acc[item];
        else acc[item] = 1;
        return acc;
      }, {})

      for (let condition in accumulatedConditions) {
        let frequency = accumulatedConditions[condition];
        if (frequency > mostFrequentConditionCount) {
          mostFrequentConditionCount = frequency;
          mostFrequentCondition = condition;
        }
      }
      return mostFrequentCondition;
    }

    dateFinalStats[day] = {
      temp: Math.round((tempsArr.reduce((acc, currentTemp) => {
        return acc + currentTemp;
      }) / tempsArr.length * 9 / 5 - 459.67)),

      conditions: getMostFrequentCondition(conditionsArr),
      icon: getMostFrequentCondition(iconArr),
      day: day
    }

  }

  console.log(dateFinalStats); // final forecast Stats to render


  return dateFinalStats;
}


$('#search').on('click', function (e) {
  const location = $('#location').val();

  fetchWeather(location);
  $('#location').val(''); // empty the input field
})

$(document).ready(function () {
  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

const fetchAddress = (lat, long) => {
  $.ajax({
    method: "GET",
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCOHlABqzocZoOxz8K2WjccJI31oHfA824`,
    dataType: "json",
    success: function (data) {
      weather.currentWeather.address = data.plus_code.compound_code;
      renderLocationWeather();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// fetchAddress(weather.currentWeather);