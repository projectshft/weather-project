const weather = {};
let latitude, longitude;

const fetchWeather = (location) => {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=2c3eee9a3a25a11d84225881a55ff923`,
    dataType: "json",
    success: function (data) {
      weather.currentWeather = data;
      fetchAddress(data.coord.lat, data.coord.lon);
      fetchForecast(data.coord.lat, data.coord.lon);
      latitude = data.coord.lat;
      longitude = data.coord.lon;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}



//if localStorage has default location, display that
if (localStorage.defaultLocation) {
  fetchWeather(localStorage.defaultLocation);

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

const renderLocationWeather = () => {
  $('#weather').empty();

  const currentTempFahrenheit = (Math.round(weather.currentWeather.main.temp * 9 / 5 - 459.67)).toString();
  const currentLocation = weather.currentWeather.name;
  const locationState = weather.currentWeather.address.split(', ')[1];
  const conditions = weather.currentWeather.weather[0].main;
  const iconURL = `http://openweathermap.org/img/wn/${weather.currentWeather.weather[0].icon}@2x.png`

  $('#weather').append(`<h2>${currentTempFahrenheit}&#xb0</h2>`);
  $('#weather').append(`<span>${currentLocation}, ${locationState}<img src=${iconURL}> <button id="set-default-city" class="btn btn-primary">Set As Default</button></span>`);
  $('#weather').append(`<h4>${conditions}</h4>`);

  // add event listener for 'set as default' button
  $('#set-default-city').on('click', function (e) {
    alert(`${currentLocation} is set as your default location`);
    if (localStorage.defaultLocation) localStorage.defaultLocation = '';
    localStorage.defaultLocation = currentLocation;
  })

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

  // render final stats
  $('#forecast').empty();

  for (let dayObj in finalStats) {
    const currentDay = moment().toString().substr(0, 3);
    let day = finalStats[dayObj];

    if (day.day !== currentDay) {
      const source = $('#forecast-template').html(); // turns handlebars template into string
      const template = Handlebars.compile(source);
      const forecastHTML = template(day);

      $('#forecast').append(forecastHTML);
    }
  }
  
  // Add Geolocation service if available
  if ("geolocation" in navigator) {

    $('#forecast').append('<button id="geolocation" class="btn btn-primary">Current Coordinates</button>');
    $('#geolocation').on('click', function () {
      navigator.geolocation.getCurrentPosition(function (position) {
        alert(`current lat: ${position.coords.latitude}, long: ${position.coords.longitude}`);
        latitude = position.coords.latitude; 
        longitude = position.coords.longitude;
        initMap(latitude, longitude)
      })
    })
  } else {
    /* geolocation IS NOT available */
    alert(`Unfortunately, geolocation services are unavailable at this time`)
  }

}

const aggregateDayForecastData = (dateObj) => {
  const dateFinalStats = {};

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
        if (frequency >= mostFrequentConditionCount) {
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
      icon: `http://openweathermap.org/img/wn/${getMostFrequentCondition(iconArr)}@2x.png`,
      day: day
    }

  }

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

let map;

function initMap(latitude,longitude) {
 // console.log('initMap called!')
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latitude, lng: longitude },
    zoom: 8
  });
}



