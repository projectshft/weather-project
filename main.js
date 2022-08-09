const key = KEY;

function renderCurrentWeather(weatherData) {
  $('.current-weather').empty();
  const { temp, city, condition, icon } = weatherData;
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);
  const newHTML = template({
    temp,
    city,
    condition,
    icon,
  });
  $('.current-weather').append(newHTML);
}

const fetch = function (query) {
  return $.ajax({
    method: 'GET',
    url: query,
    dataType: 'json',
    success(data) {
      return data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

async function getCurrentWeatherData({ lat, lon }) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;
  const result = await fetch(url);
  // console.log(result);
  // we need:
  // current temp
  // condition
  // icon
  // name of city
  const obj = {
    temp: result.main.temp ? Math.round(result.main.temp) : null,
    condition: result.weather ? result.weather[0].main : null,
    icon: result.weather ? result.weather[0].icon : null,
    city: result.name || null,
  };
  renderCurrentWeather(obj);
}

async function getCoordinates() {
  const city = $('#city').val();
  const limit = 1;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`;
  const result = await fetch(url);
  const coords = {
    lat: result[0].lat || null,
    lon: result[0].lon || null,
  };
  // console.table(coords);
  getCurrentWeatherData(coords);
}

//
$('#search').click(getCoordinates);

// =========================
// TESTING CODE
// =========================
// const lat = 41.2695965;
// const lon = -73.77527040089426;

// fetch({
//   latitude: lat,
//   longitude: lon,
// });

// async function asyncCall() {
//   console.log('calling');
//   const result = await fetch(
//     'http://api.openweathermap.org/geo/1.0/direct?q=yorktown heights&limit=1&appid=abf3979019dc7f6e55f328b41e30487e'
//   );
//   console.log(result);
//   // expected output: "resolved"
// }
// asyncCall();
