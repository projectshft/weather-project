$('document').ready(function() {


  $('#user-location-btn').on('click', function(e) {
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

      const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keys.weatherKey}&units=imperial`)
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

  $('#use-current-location-btn').on('click', function(e) {
    e.preventDefault();

    $('#location-spinner').removeClass('d-none')
    $('#location-icon').addClass('d-none disabled')


    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${keys.weatherKey}`)
        .then(response => response.ok ? response.json() : ("ERROR"))
        .then(data => {
          console.log(data[0].name, data[0].state)
          $('#user-location').val(data[0].name)
          // $('#user-state').val(data[0].state)
          const selectValue = $(`#${data[0].state}`).val()
          $('#user-state').val(selectValue)

          $('#location-spinner').addClass('d-none')
          $('#location-icon').removeClass('d-none disabled')
        })
      
    })
  })

  const toggleGetLocationSpinner = function() {
    
  }

})

