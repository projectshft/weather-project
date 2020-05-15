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
    },

  ]
};

const renderWeather = () => {
  //clear html content from page
  $('#current-weather').empty();
  $('#week').empty();

  //get weather template
  let currentSource = $('#current-template').html();

  //compile template
  let currentTemplate = Handlebars.compile(currentSource);

  //fill template with data
  let currentHtml = currentTemplate(weatherData.currentData);

  //render final html to page
  $('#current-weather').append(currentHtml);

  //render each forecast result to page with template
  weatherData.forecastData.forEach(result => {
    // get weather template
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
