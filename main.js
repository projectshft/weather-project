const apiKey = 'd42fcd703f061a26191fb5165ab48e75';
const endPoint = 'http://api.openweathermap.org/';

const sourceCurrentWeather = $('#current-weather-template').html();
const sourceForecast = $('#forecast-template').html();
// eslint-disable-next-line no-undef
const templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
// eslint-disable-next-line no-undef
const templateForecast = Handlebars.compile(sourceForecast);

// jQuery grabbers
const $city = $('#city-input');
const $searchBtn = $('#search-btn');
const $currentWeatherDiv = $('.current-weather');
const $forecastDiv = $('.forecast');

// mappings for custom icon package
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

// day of week helper function
const dayGetter = (dayObj) => {
  const dayMap = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  return dayMap[dayObj.$d.getDay()];
};

// initialize current weather obj
let currentWeather;
let forecastArr = [];

const render = () => {
  $currentWeatherDiv.empty();
  $forecastDiv.empty();

  $currentWeatherDiv.append(templateCurrentWeather(currentWeather));
  forecastArr.forEach((forecastObj) =>
    $forecastDiv.append(templateForecast(forecastObj))
  );

  // i used bootstrap to remove all right side borders so they don't stack, this adds the border back to the last box
  $($forecastDiv.children().last()).removeClass('border-end-0');
};

const addCurrentWeather = (data) => {
  currentWeather = {
    city: data.name,
    temp: Math.round(data.main.temp),
    status: data.weather[0].main,
    icon: iconMap[data.weather[0].icon],
  };
};

const addForecast = (data) => {
  forecastArr = [];
  for (let i = 7; i < 40; i += 8) {
    const forecast = data.list[i];
    forecastArr.push({
      // eslint-disable-next-line no-undef
      day: dayGetter(dayjs.unix(forecast.dt)),
      temp: Math.round(forecast.main.temp),
      status: forecast.weather[0].main,
      icon: iconMap[forecast.weather[0].icon],
    });
  }
  render();
};

const fetchWeather = (currentWeatherUrl, forecastUrl) => {
  // fetch current weather, then forecast
  $.ajax(currentWeatherUrl, {
    success: (data) => {
      addCurrentWeather(data);
      $.ajax(forecastUrl, {
        success: (forecastData) => addForecast(forecastData),
      });
    },
    error: (textStatus) => {
      alert('Not a valid input. Use city name or zip code only.');
      console.log(textStatus);
    },
  });
};

const submitSearch = () => {
  if (!$city.val()) {
    alert('Search field cannot be blank.');
    return;
  }

  const currentWeatherUrl = `${endPoint}data/2.5/weather?q=${$city.val()}&units=imperial&appid=${apiKey}`;
  const forecastUrl = `${endPoint}data/2.5/forecast?q=${$city.val()}&units=imperial&appid=${apiKey}`;

  fetchWeather(currentWeatherUrl, forecastUrl);
};

$searchBtn.on('click', () => submitSearch());
$city.on('keypress', (e) => {
  if (e.keyCode === 13) {
    submitSearch();
  }
});

// pulls austin as default city on page load
fetchWeather(
  `${endPoint}data/2.5/weather?q=austin&units=imperial&appid=${apiKey}`,
  `${endPoint}data/2.5/forecast?q=austin&units=imperial&appid=${apiKey}`
);
