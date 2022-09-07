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
  
        //API call to get weather data based on Lat and Lon
        // const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keys.weatherKey}&units=imperial`)
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${keys.oneCall}&units=imperial`)
        const locationWeatherData = await weatherResponse.json();

        showCurrentWeather(locationWeatherData)
      } catch (error) {
        console.log(error)
      }
    }

    //Populate page with current weather HTML
    function showCurrentWeather(data) {
      console.log(data)
        const currentWeatherHTML = $('#current-weather-template').html();
        const currentWeatherFunction = Handlebars.compile(currentWeatherHTML)
        const currentWeatherTemplate = currentWeatherFunction(
          {
            city: data.name || null,
            conditionURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` || null,
            temperature: Math.round(data.main.temp) || null,
            condition: data.weather[0].main
          }
        )
        $(currentWeatherTemplate).appendTo('#current-weather-container')

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

