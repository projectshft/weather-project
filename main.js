$('document').ready(function() {

  //ANCHOR Get current weather on form submit
  $('#user-location-btn').on('click', function(e) {
    e.preventDefault();
    $('#current-weather-container').empty()

    const cityValue = $('#user-location').val();
    const stateValue = $('#user-state').val()

    //API call to get the Lat and Lon of searched city/state
    async function getLocationWeather() {
      try {
        const latLonResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue},${stateValue}&limit=${1}&appid=${keys.weatherKey}`)
        const latLonData = await latLonResponse.json();

        const lat = latLonData[0].lat;
        const lon = latLonData[0].lon;
  
        //API call to get weather data for current and five day based on Lat and Lon
        const weatherResponse = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keys.weatherKey}&units=imperial`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keys.weatherKey}&units=imperial`)
        ])

        const weatherData = await Promise.all(weatherResponse.map(weather => weather.json()))

        //function call to display weather on page
        showCurrentWeather(weatherData)

        showFiveDayWeather(weatherData)
      } catch (error) {
        console.log(error)
      }
    }

    //Populate page with current weather HTML
    function showCurrentWeather(data) {

      const current = data[0];

      const currentWeatherHTML = $('#current-weather-template').html();
      const currentWeatherFunction = Handlebars.compile(currentWeatherHTML)
      const currentWeatherTemplate = currentWeatherFunction(
        {
          city: current.name || null,
          conditionURL: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png` || null,
          temperature: Math.round(current.main.temp) || null,
          condition: current.weather[0].main
        }
      )
      $(currentWeatherTemplate).appendTo('#current-weather-container')

    }

    function showFiveDayWeather(data) {
      const fiveDay = data[1]
      console.log(fiveDay)
      console.log(convertUTX(fiveDay.list[0].dt))
      console.log(convertUTX(fiveDay.list[1].dt))
    }
      

    getLocationWeather();
    $('#search-location-form').trigger('reset');
  })

  //ANCHOR button to find users current location
  $('#use-current-location-btn').on('click', function(e) {
    e.preventDefault();

    //show spinner, hide icon, disable button
    toggleLocationSpinner(true)

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${keys.weatherKey}`)
        .then(response => response.ok ? response.json() : ("ERROR"))
        .then(data => {
          console.log(data[0].name, data[0].state)
          $('#user-location').val(data[0].name)
          const selectValue = $(`#${data[0].state}`).val()
          $('#user-state').val(selectValue)

          //hide spinner, show icon, enable button
          toggleLocationSpinner(false);
        })
      
    })
  })

  const convertUTX = function(time) {
    const date = new Date(time * 1000);
    const day = date.getDay();
    const hour = date.getHours();
    return `${day} + ${hour}`;

  }

  const toggleLocationSpinner = function(status) {
    if(status) {
      $('#location-spinner').removeClass('d-none')
      $('#location-icon').addClass('d-none disabled')
    } else {
      $('#location-spinner').addClass('d-none')
      $('#location-icon').removeClass('d-none disabled')
    }
  }
})

