// add click function to search for a city and handle edge cases
// set up API calls for current weather and for single day forcast
//iterate through return values to pull out important data
//transpose any data that requires changing
//render html using handlebars
let currentWeather = {};
//adding click event to search
$('#search').click(function(event) {
  event.preventDefault();
  let city = $('#citySearch').val();
  fetchData(city)
  fetchFiveDay(city);
})

//function to collect current conditions
let addCurrentWeather = function(data) {

  currentWeather = {
    city: data.name,
    temperature: data.main.temp,
    conditions: data.weather[0].main,
    logo: data.weather[0].icon
  };
  console.log(currentWeather);
  renderCurrent(currentWeather)
}
//function to convert Kelvin to tempFahrenheit
let temperatureToFahrenheit = function(kelvin) {
  let tempFahrenheit = (9 / 5 * (kelvin - 273) + 32);
  tempFahrenheit = Math.trunc(tempFahrenheit);
  return tempFahrenheit;
}

//function to render the current conditions
renderCurrent = function (obj) {
  $('.current-forcast').empty();

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);

    //$('.current-forcast').append(contributorHTML)
    $('.current-forcast').append(template({
      "city": currentWeather.city,
      "conditions": currentWeather.conditions,
      "temperature": currentWeather.temperature
    }))
  }

//function to render the days of the week
let renderDaysOfWeek = function (obj) {
  $('#five-day-forcast-template').empty();

  for (var i = 0; i < obj.length; i++) {
    var day = obj[i];

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var contributorHTML = template(day);

    $('.current-forcast').append(contributorHTML)
  };
};



//function to collect data for five day forcast from the API return
let addFiveDayWeather = function(data2) {
  let fiveDayWeather = [];
  let todaysDate = moment().format();
  var actualDate = todaysDate.slice(0, 10);
  for (i = 0; i < data2.list.length; i++) {
    let workingDate = data2.list[i].dt_txt;
    let workingDateParsed = workingDate.slice(0, 10);
    let workingDateTime = workingDate.slice(11, 13);
    let figureOutDayOfWeek = moment(workingDateParsed).format('dddd');
    let tempInKelvin = data2.list[i].main.temp;
    let workingFTemp = temperatureToFahrenheit(tempInKelvin);
    console.log(workingFTemp);
    //console.log(temperatureToFahrenheit);
    if (workingDateTime == 00) {
      let workingFiveDay = {
        temperature: workingFTemp,
        conditions: data2.list[i].weather[0].main,
        logo: data2.list[i].weather[0].icon,
        day: figureOutDayOfWeek

      }
      fiveDayWeather.push(workingFiveDay)
    }
  }
  renderDaysOfWeek(fiveDayWeather);
}



//API call for the current forcast
let fetchData = function(city) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=dc4751020ac27d49bffd0f744199344f',
    dataType: 'jsonp',
    success: function(data) {
      addCurrentWeather(data)
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
//API call for five-day forcast
let fetchFiveDay = function(city) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&APPID=dc4751020ac27d49bffd0f744199344f',
    dataType: 'jsonp',
    success: function(data2) {
      addFiveDayWeather(data2);
      console.log(data2);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
