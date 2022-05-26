// 24ffb93bb212888072d4ae0e9d44b8c5 // API Key

// empty weather array //
const weatherArray = [];
// using ajax and geocoding api to get lat and long for each city //
const fetchLocation = (query) => {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=&appid=24ffb93bb212888072d4ae0e9d44b8c5 `,
    dataType: 'json',
    success(data) {
      const { lat } = data[0];
      const { lon } = data[0];
      console.log(lat);
      console.log(lon);
      fetchWeather(lat, lon);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

const fetchWeather = (lat, lon) => {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=24ffb93bb212888072d4ae0e9d44b8c5 `,
    dataType: 'json',
    success(data) {
      console.log(data);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};
// On click with the value of search //
$('.btn').click(() => {
  const search = $('.search-bar').val();

  fetchLocation(search);
});

fetchLocation();
