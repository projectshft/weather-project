
let day = [
    {
      day: 'Monday',
      high: 90,
      low: 75,
      icon: 'images/sun.png',
      condition: 'sunny'
    },
    {
      day: 'Tuesday',
      high: 100,
      low: 85,
      icon: 'images/sun.png',
      condition: 'sunny'
    },
    {
      day: 'Wednesday',
      high: 89,
      low: 73,
      icon: 'images/sun.png',
      condition: 'rain'
    },
    {
      day: 'Thursday',
      high: 98,
      low: 76,
      icon: 'images/sun.png',
      condition: 'sunny'
    },
    {
      day: 'Friday',
      high: 92,
      low: 67,
      icon: 'images/sun.png',
      condition: 'cloudy'
    }
  ]

let fiveDayArray = []


$('document').ready(function() {

  //ANCHOR Get current weather on form submit
  $('#user-location-btn').on('click', function(e) {
    e.preventDefault();
 

    const cityValue = $('#user-location').val();
    const stateValue = $('#user-state').val()

    //API call to get the Lat and Lon of searched city/state
    async function getLocationWeather() {
      try {
        const latLonResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue},${stateValue}&limit=1&appid=${keys.weatherKey}`)
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

    //ANCHOR Populate page with current weather HTML
    function showCurrentWeather(data) {
      $('#current-weather-container').empty()
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

    //ANCHOR Show Five Day Weather function
    function showFiveDayWeather(data) {
      fiveDayArray.length = 0; //reset array each API call
      $('#five-day-weather-container').empty()
      const fiveDay = data[1].list

      let filteredWeatherArr = fiveDay.filter((day, index) => {
        if(index === 0 || index === 7 || index === 15 || index === 23 || index === 31) {
          return day
        }
      })

      let weatherArrData = filteredWeatherArr.map(day => {
        return {
          'day': convertUTX(day.dt),
          'high': Math.round(day.main.temp),
          'low':  Math.round(day.main.temp),
          'iconURL': `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          'condition': day.weather[0].main
        }
      })

      console.log(weatherArrData)


      const fiveDayWeatherHTML = $('#five-day-weather-template').html();
      const fiveDayWeatherFunction = Handlebars.compile(fiveDayWeatherHTML);
      const fiveDayWeatherTemplate = fiveDayWeatherFunction({weatherArrData})

      console.log(fiveDayWeatherTemplate)

      $(fiveDayWeatherTemplate).appendTo('#five-day-weather-container')
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

//function to convert UTX to day of week
const convertUTX = function(time) {
  const date = new Date(time * 1000);
  const day = date.getDay();

  switch(day) {
    case 0:
      return 'Sunday'
    case 1:
      return "Monday"
    case 2:
      return "Tuesday"
    case 3:
      return "Wednesday"
    case 4:
      return "Thursday"
    case 5:
      return "Friday"
    case 6: 
      return "Saturday"
  }

}
