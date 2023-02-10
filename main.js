let current = [];
let forecast = [];

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
      addForecastWeather(data);
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

const addForecastWeather = (data) => {
  
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // get every 8th data point
  for (let i=0; i < data.list.length; i = i+8) {
    let forecastDay = {
      temp: Math.round(data.list[i].main.temp),
      day: days[dayjs(data.list[i].dt_txt).day()],
      main: data.list[i].weather[0].main,
      iconURL: `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
    }
    forecast.push(forecastDay);
  }
  renderForecastWeather();
}

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