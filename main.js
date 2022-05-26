// 24ffb93bb212888072d4ae0e9d44b8c5 // API Key

// empty weather array //
const weatherArray = [];
// using api to get the search city plus lon and lat //
const fetchCurrentWeather = (query) => {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=24ffb93bb212888072d4ae0e9d44b8c5&units=imperial`,
    dataType: 'json',
    success(data) {
      const { lon } = data.coord;
      const { lat } = data.coord;
      // Calling fetchFiveDayWeather with lon and lat from city data //
      currentWeatherObj(data);
      fetchFiveDayWeather(lat, lon);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

// using lat and lon to get the 5 day forecast //
const fetchFiveDayWeather = (lat, lon) => {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=24ffb93bb212888072d4ae0e9d44b8c5&units=imperial `,
    dataType: 'json',
    success(data) {
      // console.log(data, '5 day forecast');
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

// creating the weather object for current weather //
const currentWeatherObj = (data) => {
  console.log(data, 'current weather data');

  const weatherIcon = data.weather[0].icon;
  const mainTemp = Math.floor(data.main.temp);

  console.log(mainTemp);
  const currentObj = {
    temp: mainTemp,
    name: data.name,
    conditions: data.weather[0].main,
    icon: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
  };
  renderCurrentWeather(currentObj);
};

// Handlebars Template for currentWeather //
const renderCurrentWeather = (value) => {
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);

  const currentWeatherValue = template(value);
  $('.current-weather').append(currentWeatherValue);
};

// On click with the value of search //
$('.btn').click(() => {
  const search = $('.search-bar').val();
  fetchCurrentWeather(search);
});

fetchCurrentWeather();

// // 24ffb93bb212888072d4ae0e9d44b8c5 // API Key

// // empty weather array //
// const weatherArray = [];
// // using ajax and geocoding api to get lat and long for each city //
// const fetchLocation = (query) => {
//   $.ajax({
//     method: 'GET',
//     url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=&appid=24ffb93bb212888072d4ae0e9d44b8c5 `,
//     dataType: 'json',
//     success(data) {
//       const { lat } = data[0];
//       const { lon } = data[0];

//       fetchFiveDayWeather(lat, lon);
//     },
//     error(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// };
// // using lat and lon to get the location of the search plus the 5 day forecast  //
// const fetchFiveDayWeather = (lat, lon) => {
//   $.ajax({
//     method: 'GET',
//     url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=24ffb93bb212888072d4ae0e9d44b8c5&units=imperial `,
//     dataType: 'json',
//     success(data) {
//       weatherObj(data);
//     },
//     error(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// };

// const fetchCurrentWeather = (query) => {
//   $.ajax({
//     method: 'GET',
//     url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=24ffb93bb212888072d4ae0e9d44b8c5 `,
//     dataType: 'json',
//     success(data) {
//       console.log(data, 'current weather');
//     },
//     error(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// };

// // creating the weather object //
// const weatherObj = (data) => {
//   console.log(data);
// };
// // On click with the value of search //
// $('.btn').click(() => {
//   const search = $('.search-bar').val();
//   fetchCurrentWeather(search);
//   fetchLocation(search);
// });

// fetchLocation();

// `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
