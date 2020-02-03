// Model
// Create two empty arrays to store data responses
var currentWeather = [];
var fiveDayWeather = [];

// Create a fetch function to get current weather data from Open Weather API
var fetch = function(query) {

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + "&appid=fd9c1cb4eb6ab4ecba76da13be5e4e52",
    dataType: "json",
    success: function(data) {
      populateCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Alert user if Open Weather API does not return data
      alert('Error. Server is unable to locate city.');
    }
  });
};

// Create a function to push returned data into the currentWeather array
var populateCurrentWeather = function(data) {

// Empty the weather array
  currentWeather = [];

// Grab only the information we need and push it, as an object, into the weather array
  currentWeather.push({
    temperature: Math.round(data.main.temp),
    cityName: data.name,
    weatherDescription: data.weather[0].main,
    weatherIcon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
  });
// Invoke the renderWeather function to add the data to the page
  renderCurrentWeather();
};

// Create a second fetch function to get five day weather data from Open Weather API
var fetchFiveDayWeather = function(query2) {

  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + query2 + "&units=imperial" + "&appid=fd9c1cb4eb6ab4ecba76da13be5e4e52" + "&count=5",
    dataType: "json",
    success: function(data) {
      populateFiveDayWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// Create a function to push returned data into the fiveDayWeather array
var populateFiveDayWeather = function(data) {
  // Empty the five day weather array
  fiveDayWeather = [];

// Loop through the returned 5 day weather data of 40 arrays (updates every 3 hours)
// Need to increase the index by 8 to grab data from each day
  for (var i = 0; i < data.list.length; i = i + 8) {

// Grab only the information we need and push it, as an object, into the fiveDayWeather array
    fiveDayWeather.push({
      time: moment(data.list[i].dt_txt).format('dddd'),
      temperature: Math.round(data.list[i].main.temp),
      cityName: data.city.name,
      weatherDescription: data.list[i].weather[0].main,
      weatherIcon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
    });
  };
// Invoke the renderFiveDayWeather to add the data to the page
  renderFiveDayWeather()
};

// Create a function that appends local storage
var setDefault = function () {

// Removes current items from local storage
  localStorage.removeItem('currentWeather');
  localStorage.removeItem('fiveDayWeather');

// Replaces removed items with the new default items
  localStorage.setItem('currentWeather', JSON.stringify(currentWeather))
  localStorage.setItem('fiveDayWeather', JSON.stringify(fiveDayWeather))
};


// View
// Create a function that renders the data in the currentWeather array to the page
var renderCurrentWeather = function() {
  $('.search').html('<span></span> Search')
  $('.currentWeather').empty();

// Loop through the currentWeather array and add objects to the page using a Handlebars template
  for (var i = 0; i < currentWeather.length; i++) {
    var source = $('#currentWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeather[i]);
    $('.currentWeather').append(newHTML);

    // Append HTML to add Set As Default button underneath current weather
    $('.setdefault').append('<button type="button" class="btn btn-primary btn-sm setDefault col-md-2">Set as Default</button>')
  }
};

// Create a function that renders data in fiveDayWeather array to the page
var renderFiveDayWeather = function() {
  $('.fiveDayWeather').empty();

// Loop through the fiveDayWeather array and add objects to the page using a Handlebars template
  for (var i = 0; i < fiveDayWeather.length; i++) {
    var source = $('#fiveDayWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayWeather[i]);
    $('.fiveDayWeather').append(newHTML)
  };
};

// Create a function that renders data in local storage to the page
var renderDefault = function() {

// Get and parse data from local storage and store in new variables
  let weatherArray = localStorage.getItem('currentWeather') ? JSON.parse(localStorage.getItem('currentWeather')) : []
  let fiveDayWeatherArray = localStorage.getItem('fiveDayWeather') ? JSON.parse(localStorage.getItem('fiveDayWeather')) : []

// Loop through new weatherArray and add objects to the page using a default Handlebars template
  for (var i = 0; i < weatherArray.length; i++) {
    var source = $('#defaultWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherArray[i]);
    $('.default-weather').append(newHTML);
  }

// Loop through new fiveDayWeatherArray and add objects to the page using a default Handlebars template
  for (var i = 0; i < fiveDayWeatherArray.length; i++) {
    var source = $('#defaultFiveDayWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayWeatherArray[i]);
    $('.default-fiveDayWeather').append(newHTML)
  }
}

// Invoke renderDefault every time the page is loaded
renderDefault();


// Controller
// Create click event on search button
$('.search').on('click', function() {
// Account for edge case if user leaves input box empty
  if ($('#search-query').val() == '') {
    alert('Search input can not be left blank')
  } else {

  var search = $('#search-query').val();
  $('.setdefault').empty()

// Initiate MVC cycle by invoking both fetch functions to get data from Open Weather API
  fetch(search);
  fetchFiveDayWeather(search);
  }
});

// Create click event on set as default button
$('.setdefault').click(function() {
// Invoke set default function to save data to local storage
  setDefault();
})
