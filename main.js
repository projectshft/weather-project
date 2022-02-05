const apiKey = 'd42fcd703f061a26191fb5165ab48e75';
const endPoint = 'http://api.openweathermap.org/';

const source = $('#current-weather-template').html();
// eslint-disable-next-line no-undef
const template = Handlebars.compile(source);

// jQuery grabbers
const $city = $('#city-input');
const $searchBtn = $('#search-btn');
const $currentWeatherDiv = $('.current-weather');

const iconMap = {
  '01d': 'wi-day-sunny',
  '02d': 'wi-day-cloudy',
  '03d': 'wi-cloudy',
  '04d': 'wi-cloudy',
  '09d': 'wi-day-showers',
  '10d': 'wi-day-rain',
  '11d': 'wi-day-thunderstorm',
  '13d': 'wi-day-snow',
  '50d': 'wi-dust',
  '01n': 'wi-night-clear',
  '02n': 'wi-night-alt-cloudy',
  '03n': 'wi-cloudy',
  '04n': 'wi-cloudy',
  '09n': 'wi-night-showers',
  '10n': 'wi-night-rain',
  '11n': 'wi-night-thunderstorm',
  '13n': 'wi-night-snow',
  '50n': 'wi-dust',
};

let currentWeather;

const render = () => {
  $currentWeatherDiv.empty();
  $currentWeatherDiv.append(template(currentWeather));
};

const addCurrentWeather = (data) => {
  currentWeather = {
    city: data.name,
    temp: Math.round(data.main.temp),
    status: data.weather[0].main,
    icon: iconMap[data.weather[0].icon],
  };
  render();
};

const fetchWeather = (url) => {
  // fetch current weather
  $.ajax(url, {
    success: (data) => addCurrentWeather(data),
    error: (textStatus) => {
      alert('Not a valid input. Use city name or zip code only.');
      console.log(textStatus);
    },
  });
};

$searchBtn.on('click', () => {
  if (!$city.val()) {
    alert('Search field cannot be blank.');
    return;
  }

  const currentWeatherUrl = `${endPoint}data/2.5/weather?q=${$city.val()}&units=imperial&appid=${apiKey}`;

  fetchWeather(currentWeatherUrl);
});
