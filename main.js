let cityCurrentWeather = [];
let cityFiveDayWeather = [];

const addCurrentWeatherDataToArray = (data) => {
  const fahrenheitFromKelvin = Math.floor(data.main.temp / 3.493);
  const newCityAndWeatherCurrentData = {
    city: data.name,
    temp: fahrenheitFromKelvin,
    description: data.weather[0].description,
  };
  cityCurrentWeather.push(newCityAndWeatherCurrentData);
};

const renderCurrentWeather = () => {
  $('#currentWeatherData').empty();
  // console.log(cityCurrentWeather);

  for (let i = 0; i < cityCurrentWeather.length; i++) {
    let weather = cityCurrentWeather[i];

    const source = $('#current-weather-template').html();
    const template = Handlebars.compile(source);
    const weatherHTML = template(weather);

    $('#currentWeatherData').append(weatherHTML);
    $('#cityName').val('');
    cityCurrentWeather = [];
  }
};

const fetchData = (cityName) => {
  $.ajax({
    method: 'GET',
    url:
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      cityName +
      '&appid=1223294114fb8930caf177ea3451f02c',
    dataType: 'json',
    success: function (data) {
      console.log(data);
      addCurrentWeatherDataToArray(data);
      renderCurrentWeather();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(
        'Please enter a city name with correct spelling and spacing. \nYou can use upper or lower case.'
      );
      console.log(textStatus);
    },
  });
};

$('.search').on('click', function () {
  $('#currentWeatherData').empty();
  console.log('clicked');
  const cityName = $('#cityName').val();
  fetchData(cityName);
});



// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}
