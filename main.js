// const currentWeather = {
//   city: 'Austin, TX',
//   temperature: '91',
//   condition: 'sunny'
// }

$('document').ready(function() {


  $('#user-location-button').on('click', function(e) {
    e.preventDefault();
    $('#current-weather-container').empty()

    const cityValue = $('#user-location').val();
    const stateValue = $('#user-state').val()
    console.log(cityValue,stateValue)

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue},${stateValue}&limit=${1}&appid=371e007761abd9ab85f149c680e677ac`)
      .then((response) => response.json())
      .then((data) => console.log(data))

    $('#search-location-form').trigger('reset')
  })
})