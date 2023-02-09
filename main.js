let current = [];
let forecast = [
  {
    temp: 62,
    day: 'Friday',
    main: 'Clouds',
    iconURL: `http://openweathermap.org/img/wn/01d@2x.png`
  },
  {
    temp: 62,
    day: 'Saturday',
    main: 'Clouds',
    iconURL: `http://openweathermap.org/img/wn/01d@2x.png`
  },
  {
    temp: 62,
    day: 'Sunday',
    main: 'Clouds',
    iconURL: `http://openweathermap.org/img/wn/01d@2x.png`
  },
  {
    temp: 62,
    day: 'Monday',
    main: 'Clouds',
    iconURL: `http://openweathermap.org/img/wn/01d@2x.png`
  },
  {
    temp: 62,
    day: 'Tuesday',
    main: 'Clouds',
    iconURL: `http://openweathermap.org/img/wn/01d@2x.png`
  }
];

$('.search').on('click', function () {
  let query = $('#search-query').val();

  currentWeather(query);

  // clears input
  $('#search-query').val('');
})

const currentWeather = (query) => {
  // current weather
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=4df43207cfa7a1f67f6f7fbd99044f1c&units=imperial`,
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  // forecast weather
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=4df43207cfa7a1f67f6f7fbd99044f1c&units=imperial`,
    dataType: "json",
    success: function(data) {
      // TODO: add "data" to addForecastWeather function
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

const addCurrentWeather = (data) => {

  let currentWeather = {
    temp: Math.round(data.main.temp),
    name: data.name,
    main: data.weather[0].main,
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  }

  current.push(currentWeather);
  renderCurrentWeather();
}

// TODO: create addForecastWeather function


const renderCurrentWeather = () => {
  // empty current weather div
  $('.current').empty();

  for (let i=0; i < current.length; i++) {
    let source = $('#current-template').html();
    let resultTemplate = Handlebars.compile(source);

    let newWeather = resultTemplate(current[i]);
    $('.current').append(newWeather);
  }

  // empty current weather array
  current = [];
};

const renderForecastWeather = () => {
  // empty forecast weather div
  $('.forecast').empty();

  for (let i=0; i < forecast.length; i++) {
    let source = $('#forecast-template').html();
    let resultTemplate = Handlebars.compile(source);

    let newWeather = resultTemplate(forecast[i]);
    $('.forecast').append(newWeather);
  }

  // empty current weather array
  forecast = [];
};

renderForecastWeather();
