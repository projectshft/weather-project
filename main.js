// A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
// A user should be able to see the current temperature (in imperial units).
// A user should be able to see the current conditions (whether it's cloudy, raining, etc).
// When a user does another search, their first search should be replaced.

let weatherList = [];

let weatherForecast = [];

let $weather = $('#weather-list');


let renderWeather = function () {
  console.log('5');
  $weather.children().empty();
    let source = $('#weather-template').html();
    let template = Handlebars.compile(source);
    let newHTML = template(weatherList[0]);
    $weather.append(newHTML);
    console.log($weather);

};
let fetchForecast = function (query) {
  console.log('2.5');
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + encodeURI(query) + "&units=imperial&APPID=86c279f98dcc643c839697fc7fd258a6",
    dataType: "json",
    success: function(dataf) {
      addForecast(dataf);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

let addWeather = function (data) {
  weatherList.length = 0;
  weatherForecast.length = 0;
  console.log('3');
  console.log('first', weatherForecast);
  console.log('before:', weatherList);
  console.log('after:', weatherList);
  console.log('second', weatherForecast);
  let citySearchReturn = {
    temperature: Math.round(data.main.temp),
    cityName: data.name,
    country: data.sys.country,
    weatherDescription: data.weather['0'].description,
    weatherIcon: data.weather['0'].icon,
    forecast: weatherForecast

  }
  weatherList.push(citySearchReturn);
  let search = $('#search-query').val();
  fetchForecast(search);
  console.log('3.5');
};


let fetchCurrent = function (query) {
  console.log('2');
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + encodeURI(query) + "&units=imperial&APPID=86c279f98dcc643c839697fc7fd258a6",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

$('#btn').on('click', function () {
  console.log('1');
  let search = $('#search-query').val();
  fetchCurrent(search);
});

let addForecast = function (dataf) {
  weatherForecast.length = 0;
  console.log('4');

  for (let i = 0; i < dataf.list.length; i++) {
    let timeOfDay = moment(moment(dataf.list[i].dt_txt)).hour();
    if (!timeOfDay == '18') {
  //Selected noon as the timestamps to keep for the five day forecast.
    } else if (timeOfDay == '18') {
      //moment.day turns the timestamp into a number associated with a day of the week hence the array which index corresponds to days.
      let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let forecast = {
        forecastDescription: dataf.list[i].weather[0].description,
        //use math.round to round the decimal temperatures to a nice integer.
        forecastTemperature: Math.round(dataf.list[i].main.temp),
        forecastIcon: dataf.list[i].weather[0].icon,
        dayOfWeek: daysOfWeek[moment(moment(dataf.list[i].dt_txt)).day()]
      }

      weatherForecast.push(forecast);
      renderWeather();
    };
    //console.log(weather);
  };
};


// After a user has searched a city (and that city's weather information is currently displaying), the user should see a "Set as Default" button. When the user clicks this button, there should be some indication that the current city is set as their default city. If the user refreshes the page, instead of a blank screen and search bar, their default city's info should come up.
// $('#btn').on('click', function () {
//   $('.input-group-btn').append('<button id="set-default" class="btn btn-secondary set-default" type="button">Set As Default</button>')
// });

// $('#set-default').on('click', function () {
//   $('button.set-default').replaceWith('<button id="default-set" class="btn btn-secondary default-set" type="button">Default Saved</button>');
//
// })
// var setDefault = JSON.parse(localStorage.setDefault || null) || {};
//
// let saveDefault = function (obj) {
//   setDefault.obj = obj;
//   setDefault.time = new Date().getTime();
//   localStorage.setDefault = JSON.stringify(setDefault);
// }
//
// let loadDefault = function () {
//   return setDefault.obj || "default";
// }
