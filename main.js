// add click function to search for a city and handle edge cases
// set up API calls for current weather and for single day forcast
//iterate through return values to pull out important data
//transpose any data that requires changing
//render html using handlebars

//set a global variable object to hold the current weather data
let currentWeather = {};
//adding click event to search
$('#search').click(function(event) {
  event.preventDefault();
  //clears the five day forcast from the window
  clearFiveDay();
  let city = $('#citySearch').val();

  //triggers both API calls on each click
  fetchData(city)
  fetchFiveDay(city);
  //resets form to default after each submission
  $('#citySearch').val("")
})
//function to clear each column where five-day forcast info is displayed
let clearFiveDay = function() {
  $('#col0').empty();
  $('#col1').empty();
  $('#col2').empty();
  $('#col3').empty();
  $('#col4').empty();
}

//function to collect current conditions from API JSON
let addCurrentWeather = function(data) {
  //converts the kelvin temp that was returned into Fahrenheit
  let currentTempInFahrenheit = temperatureToFahrenheit(data.main.temp)
  //stores current weather in an object
  currentWeather = {
    city: data.name,
    temperature: currentTempInFahrenheit,
    conditions: data.weather[0].main,
    logo: data.weather[0].icon
  };
  //invokes rendering function for the current weather with the object passed in
  renderCurrent(currentWeather)
}

//function to convert Kelvin to tempFahrenheit
let temperatureToFahrenheit = function(kelvin) {
  let tempFahrenheit = (9 / 5 * (kelvin - 273) + 32);
  tempFahrenheit = Math.trunc(tempFahrenheit);
  return tempFahrenheit;
}

//function to render the current conditions
renderCurrent = function(obj) {
  //empties the display for the current forcast
  $('.current-forcast').empty();
  //calls handlebars template and passes it the necessary information
  let source = $('#current-weather-template').html();
  let template = Handlebars.compile(source);

  //utilizes handlesbars to append the current forcast to the page
  $('.current-forcast').append(template({
    "city": currentWeather.city,
    "conditions": currentWeather.conditions,
    "temperature": currentWeather.temperature,
    "img": currentWeather.logo
  }))
}

//function to render the days of the week
let renderDaysOfWeek = function(arr) {
  $('#five-day-forcast-template').empty();

  //loops through the 5-day array
  for (let i = 0; i < arr.length; i++) {
    let day = arr[i];
    //sets up handlebars to take in the current info as it loops through the five-day array
    let source = $('#current-weather-template').html();
    let template = Handlebars.compile(source);
    //appends the forcast for each day at the specified column as it loops through
    $('#col' + i).append(template({
      "day": day.day,
      "conditions": day.conditions,
      "temperature": day.temperature,
      "img": day.logo
    }));
  };
};

//function to collect data for five day forcast from the API return
let addFiveDayWeather = function(data2) {
  //variable to store all five objects in for each day of the five-day forcast
  let fiveDayWeather = [];
  //uses moments to get the date at the time of the API call
  let todaysDate = moment().format();
  //extracts just the date and removed the time from the string returned
  let actualDate = todaysDate.slice(0, 10);
  //iterateds through the json object returned from the API call
  for (i = 0; i < data2.list.length; i++) {
    //extracts the date from the json object
    let workingDate = data2.list[i].dt_txt;
    //pulls the date away from the time
    let workingDateParsed = workingDate.slice(0, 10);
    //pulls the first two values of the time interval in order to compare for ensuring that I was grabbing the right days
    let workingDateTime = workingDate.slice(11, 13);
    //uses Moments to pull out the day of the week from the date provided
    let figureOutDayOfWeek = moment(workingDateParsed).format('dddd');
    //since it could depend on when the API call was run, used the return time of 00, since I would always get five of them
    //regardless of when the call was made
    if (workingDateTime == 00) {
      //extracts the temp in kelvin and used a function to convert it to Fahrenheit
      let tempInKelvin = data2.list[i].main.temp;
      let workingFTemp = temperatureToFahrenheit(tempInKelvin);
      //stores each day of the five-day forcast into an object
      let workingFiveDay = {
        temperature: workingFTemp,
        conditions: data2.list[i].weather[0].main,
        logo: data2.list[i].weather[0].icon,
        day: figureOutDayOfWeek
      }
      //adds each object that represented a day to the fiveDayWeather array
      fiveDayWeather.push(workingFiveDay)
    }
  }
  //calls render function passing it the array storing each day's weather of the five
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
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      //added an alert to check for empty strings or any other issues with the search
      alert("We could not locate the requested city. Please check your spelling and try again.")
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
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
