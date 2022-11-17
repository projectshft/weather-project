let weather = [];
let forecast = [];

$('button').on('click', () => {
  const search = $('#search-query').val();
  fetchCurrent(search);
  fetchForecast(search);
});

const fetchCurrent = function (query) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=0702edfc3eb12eb39b2cef3998b1d802&units=imperial`,
    dataType: 'json',
    success(data) {
      addWeather(data);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert('Invalid city, try again.');
    },
  });
};

const fetchForecast = function (query) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=0702edfc3eb12eb39b2cef3998b1d802&units=imperial`,
    dataType: 'json',
    success(data) {
      addForecast(data);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

const addWeather = function (data) {
  weather = [];

  const weatherCurrent = {
    temperature: `${data.main.temp}°`,
    city: data.name,
    conditions: data.weather[0].main,
    icon: data.weather[0].icon,
  };
  weather.push(weatherCurrent);
  renderWeather();
};

const addForecast = function (data) {
  forecast = [];

  for (let i = 0; i < data.list.length; i += 1) {
    if (i === 1 || i === 9 || i === 18 || i === 26 || i === 36) {
      const dt = moment(data.list[i].dt_txt, 'YYYY-MM-DD HH:mm:ss');
      const forecastCurrent = {
        conditions: data.list[i].weather[0].main,
        temperature: `${data.list[i].main.temp}°`,
        icon: data.list[i].weather[0].icon,
        day: dt.format('dddd'),
      };
      forecast.push(forecastCurrent);
    }
  }
  renderForecast();
  console.log(forecast);
};

const renderWeather = function () {
  $('.weather-current').empty();
  const source = $('#weather-template').html();
  const template = Handlebars.compile(source);
  const newHTML = template(weather[0]);

  $('.weather-current').append(newHTML);
};

const renderForecast = function () {
  $('.weather-forecast').empty();
  for (let i = 0; i < forecast.length; i += 1) {
    const oneDay = forecast[i];
    const source = $('#forecast-template').html();
    const template = Handlebars.compile(source);
    const newHTML = template(oneDay);

    $('.weather-forecast').append(newHTML);
  }
};
