let weather = {};

const getSearchQuery = () => $('#search-query').val();

const loader = {
  load: () => {
    $('#get-location-btn')
      .html(`<img src="assets/three-dots.svg" class="text-primary px-3" style="height: 10px"/>`);
  },
  reset: () => {
    $('#get-location-btn')
      .html('or Get Current Location');
  }
};

// Search button handler
$('#get-location-btn').click(() => {
  getCurrentPos();
  renderReset();
  loader.load();
});

// Search button handler
$('#search-btn').click(() => {
  loader.load();
  submitWeatherRequest(getSearchQuery());
});

// Search input key handler for 'enter/return' 
$('#search-query').keydown((e) => {  
  if(e.keyCode === 13) {
    e.preventDefault();
    loader.load();
    submitWeatherRequest(getSearchQuery());
  }
});

const submitWeatherRequest = query => {
  weather = {};
  if ([...query].every(c => c === ' ') 
      || query.length === 0) {
    alert('Please enter city');
    loader.reset();
  } else {
    fetchLocationViaCity(query);
    renderReset();
  }
}
 
const fetchLocationViaCity = query => {
  return fetch(
      "http://"
      + "api.openweathermap.org/geo/1.0/direct?q="
      + query
      + "&limit=1"
      + "&appid=4230d88dcd920385ffe81333658fae0f"
    )
    .then(response => response.json())
    .then(data => addLocationGetWeather(...data))
    .catch(error => alert('City not found'));
}

const fetchLocationViaCoords = (lat, lon) => {
  return fetch(
      "http://"
      + "api.openweathermap.org/geo/1.0/reverse?"
      + "lat=" + lat
      + "&lon=" + lon
      + "&limit=1"
      + "&appid=4230d88dcd920385ffe81333658fae0f"
    )
    .then(response => response.json())
    .then(data => addLocationGetWeather(...data))
    .catch(error => alert('Coordinates not found'));
}

const addLocationGetWeather = data => {
  weather = {
    ...weather,
    city: data.name,
    state: data.state,
    country: data.country,
    location: (data.state ? (data.state  + ', ') : '') + data.country,
    lat: data.lat,
    lon: data.lon
  }
  
  fetchWeather(weather.lat, weather.lon);
}

const fetchWeather = (lat, lon) => {
  return fetch(
      "https://"
      + "api.openweathermap.org/data/2.5/onecall?"
      + "lat=" + lat
      + "&lon=" + lon
      + "&exclude=minutely,hourly,alerts"
      + "&appid=4230d88dcd920385ffe81333658fae0f"
      + "&units=imperial"
    )
    .then(response => response.json())
    .then(data => addWeather(data))
    .catch(error => console.log(error));
}

const addWeather = (data) => {
  weather = {
    ...weather,
    current: getCurrent(data),
    daily: getDaily(data)
  };
  
  renderCurrentWeather(weather);
  renderForecast(weather);
  $('.section-header').removeClass('d-none');
}

const getCurrent = data => {
  return {
    temp: Math.round(data.current.temp),
    cond: data.current.weather[0].main,
    icon: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
  }
}

const getDaily = data => {
  return data.daily.reduce((start, item, index) => {
    return (
      index >= 1 && index <= 5 ?
      [
        ...start,
        {
          ...getDate(item.dt),
          temp: Math.round(item.temp.max),
          cond: item.weather[0].main,
          icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        }
      ] :
      start
    )
  }, []);
}

const renderCurrentWeather = obj => {
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(obj);

  $('#current-weather-container').append(newHTML);
  loader.reset();
  renderDefaultBtn();
  renderResetBtn();
};

const renderForecast = data => {
  data.daily.forEach(item => renderForecastItem(item))
}

const renderForecastItem = obj => {
  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(obj);

  $('#forecast-container').append(newHTML);
};

const renderReset = () => {
  $('#search-query').val('');
  $('#current-weather-container').empty();
  $('#forecast-container').empty();
  $('.section-header').addClass('d-none');
}

const getDate = x => {
  const date = new Date(x * 1000);

  const options = [
    { weekday: 'long' },
    { month: 'long', day: 'numeric' }
  ];
  
  const weekday = date.toLocaleDateString(undefined, options[0]);
  const day = date.toLocaleDateString(undefined, options[1]);

  return { weekday, day }
}

// Default Location Functions

const getDefaultLocation = () => localStorage.getItem('defaultLocation');

const setDefaultLocation = () => {
  if (weather.city) {
    localStorage.setItem('defaultLocation', weather.city);
  }
}

const renderDefaultLocation = () => {
  if (getDefaultLocation()) {
    submitWeatherRequest(getDefaultLocation());
  }
}

renderDefaultLocation()

// Default button handlers

$('#set-default-btn').click(() => {
  setDefaultLocation();
  renderDefaultBtn();
  renderResetBtn();
});

$('#reset-default-btn').click(() => {
  localStorage.clear();
  renderDefaultBtn();
  renderResetBtn();
});

const renderDefaultBtn = () => {
  if (weather.city === getDefaultLocation()) {
    $('#set-default-btn').html('Current Default Location');
    $('#set-default-btn').removeClass('btn-outline-primary')
    $('#set-default-btn').addClass('btn-primary')
  } else {
    $('#set-default-btn').html('Set as Default');
    $('#set-default-btn').removeClass('btn-primary')
    $('#set-default-btn').addClass('btn-outline-primary')
  }
}

const renderResetBtn = () => {
  if (getDefaultLocation()) {
    $('#reset-default-btn').removeClass('d-none')
  } else {
    $('#reset-default-btn').addClass('d-none')
  }
}

// Geolocation API

const getCurrentPos = () => {
  const currentPos = () => navigator.geolocation.getCurrentPosition(onSuccess, onError);
  
  const onSuccess = position => {
    const {latitude, longitude} = position.coords;
    fetchLocationViaCoords(latitude, longitude);
  };
  
  const onError = () => {
    loader.reset();
    console.log(`Failed to get your location!`);
  }

  currentPos()
}