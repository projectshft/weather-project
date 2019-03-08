/** Weather module */
const weatherModule = () => {
  const state = {
    API_KEY: "60271f8873cd6fca6c2b2ce6c281a2c6",
    temperature: '',
    city: '',
    condition: '',
  }

  /** getter */
  var getAttribute = (attribute) => {
    if (state.hasOwnProperty(attribute)) {
      return state[attribute];
    }
  }

  /**
   * Gets the weather forecast with the user input as a query. Makes a
   * call to the OpenWeatherMap Api
   * @param { String } city - The city to get the weather forecast
   */
  var getWeatherForecast = async (city) => {
    const apiCall = await fetch('http://api.openweathermap.org/data/2.5/forecast?q=durham,us&appid=60271f8873cd6fca6c2b2ce6c281a2c6');
    const data = await apiCall.json();
    console.log('data for 5 days: ', data);
  }

  /**
   * Gets the current weather with the user input as a query. Api call
   * to OpenWeatherMap.
   * @param { String } city - The city to get the current weather
   */
  var getCurrentWeather = (city) => {
    const res = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${state.API_KEY}`)
      .then(result => {
        if (result.ok) {
          return result.json();
        } else {
          return false;
        }
      })
      .then(data => {
        const fahrenheit = Math.ceil((data.main.temp - 273) * 9 / 5 + 32);
        state['city'] = data.name;
        state['temperature'] = fahrenheit;
        state['condition'] = data.weather[0].main;
        return true;
      })
      .catch(err => {
        return false;
      });

    return res;
  }

  return {
    getWeatherForecast: getWeatherForecast,
    getCurrentWeather: getCurrentWeather,
    getAttribute: getAttribute
  }
};


$(document).ready(function () {
  const weather = weatherModule();

  $('#get-weather').on('click', async function (e) {
    e.preventDefault();
    var searchInput = $(e.target).closest('.form-container').find('#weather-input').val();

    var resultIsOk = await weather.getCurrentWeather(searchInput);
    if (resultIsOk) {
      var template = await Handlebars.compile($('#weather-template').html());

      var newHtml = template({
        degrees: weather.getAttribute('temperature'),
        city: weather.getAttribute('city'),
        weather: weather.getAttribute('condition')
      });
      $('.current-weather--container').append(newHtml);
    } else {
      alert(`Sorry the location "${searchInput}" was not found. Please check your search criteria and try again.`);
    }

  });
});