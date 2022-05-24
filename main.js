let weather = {};

// Search button handler
$('#search-btn').click(() => {
  submitWeatherRequest();
});

// Search input key handler for 'enter/return' 
$('#search-query').keydown((e) => {  
  if(e.keyCode === 13) {
    e.preventDefault();
    submitWeatherRequest();
  }
});

const submitWeatherRequest = () => {
  weather = {};
  if ([...$('#search-query').val()].every(c => c === ' ') 
      || $('#search-query').val().length === 0) {
    alert('Please enter city')
  } else {
    fetchCoords($('#search-query').val());
    $('#search-query').val('');
    $('#current-weather-container').empty();
    $('#forecast-container').empty();
    $('.section-header').removeClass('d-none');
  }
}
 
const fetchCoords = query => {
  return fetch(
      "http://"
      + "api.openweathermap.org/geo/1.0/direct?q="
      + query
      + "&limit=1"
      + "&appid=4230d88dcd920385ffe81333658fae0f"
    )
    .then(response => response.json())
    .then(data => addCoords(...data))
    .catch(error => alert('City not found'));
}

const addCoords = data => {
  weather = {
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