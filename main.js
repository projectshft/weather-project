const weatherData = {
  currentData: {
    city: 'West Palm Beach',
    state: 'Florida',
    temp: '80',
    condition: 'Sunny'
  },
  forecastData: [{
      day: 'Monday',
      temp: '80',
      condition: 'Sunny'
    },
    {
      day: 'Tuesday',
      temp: '80',
      condition: 'Sunny'
    },
    {
      day: 'Wednesday',
      temp: '80',
      condition: 'Sunny'
    },
    {
      day: 'Thursday',
      temp: '80',
      condition: 'Sunny'
    },
    {
      day: 'Friday',
      temp: '80',
      condition: 'Sunny'
    }
  ]
};




/*
//store returned weather results
const addWeather = (data) => {
  //store current weather in object
  let currentWeather = {
    city: data.[],
    state: data.[],
    temp: data.[],
    condition: data.[]
  }

//add current weather object to weatherData object
weatherData.currentData = currentWeather;

//need to take (40) 3 hour forecasts and store them in array of objects with date/temp/condition
//split array into 5 arrays of 8 based on timestamps
//average each of the 5 arrays to find daily temp and condition
//add to weatherData forecast array, assigning day of week based on current day
  let dailyForecast = {
    day: data.[],
    temp: data.[],
    condition: data.[]
  }
};
*/


//take stored weather data and display it on the page
const renderWeather = () => {
  //clear html content from page
  $('#current-weather').empty();
  $('#week').empty();

  //get current weather template
  let currentSource = $('#current-template').html();

  //compile template
  let currentTemplate = Handlebars.compile(currentSource);

  //fill template with data
  let currentHtml = currentTemplate(weatherData.currentData);

  //render final html to page
  $('#current-weather').append(currentHtml);

  //render each forecast result to page with template
  weatherData.forecastData.forEach(result => {
    // get forecast weather template
    let forecastSource = $('#forecast-template').html();

    // compile template
    let forecastTemplate = Handlebars.compile(forecastSource);

    // fill template with data
    let forecastHtml = forecastTemplate(result);

    // render final html to page
    $('#week').append(forecastHtml);

    $('#forecast-header').removeClass('hide');
  });
};

//add click event to search button to get data and render results
$('#search-button').click(() => {
  fetchWeather();
});
