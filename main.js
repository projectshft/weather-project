const currentWeather = {
  city: 'Austin, TX',
  temperature: '91',
  condition: 'sunny'
}

$('document').ready(function() {


  $('#user-location-button').on('click', function(e) {
    e.preventDefault();
    $('#current-weather-container').empty()

    const cityValue = $('#user-location').val();
    const stateValue = $('#user-state').val()
    console.log(cityValue,stateValue)

    async function getLocationWeather() {
      const response1 = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue},${stateValue}&limit=${1}&appid=371e007761abd9ab85f149c680e677ac`)
      const latLonData = await response1.json();
      const lat = latLonData[0].lat;
      const lon = latLonData[0].lon;

      console.log(lat, lon)

      const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=371e007761abd9ab85f149c680e677ac&units=imperial`)
      const locationWeatherData = await response2.json();
      console.log(locationWeatherData)
      return locationWeatherData;
    }

    function showCurrentWeather() {
      getLocationWeather().then(data => {
        console.log(data)
        const currentWeatherHTML = $('#current-weather-template').html();
        const currentWeatherFunc = Handlebars.compile(currentWeatherHTML)
        const currentWeatherTemplate = currentWeatherFunc(
          {
            city: data.name || null,
            conditionURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` || null,
            temperature: Math.round(data.main.temp) || null,
            condition: data.weather[0].main
          }
        )
        console.log(currentWeatherTemplate)
        $(currentWeatherTemplate).appendTo('#current-weather-container')
      })
    }
    showCurrentWeather();

  })
})
