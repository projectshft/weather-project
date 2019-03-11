// USE LOCAL STORAGE to store location
// USE MOMENT for timestamp
// USE POJO(s) to store data received from API

/*****************************************

   OPENWEATHER API doesn't work with "https://"
   Browser address bar must use "http://"
   
******************************************/

// OpenWeather API Keys

// Key: 2b2a168d8dac44dd31cfd36829f44f93   Name: Lucas
// Key: add32f7253f0ba69178d0ca6ee5ef2b3   Name: Default

'use strict';

/*****************************************
// Add a function to return a formatted date.

// Get current date if numbersOfDaysToAdd = 0
var getFutureDate = function(day) {};
******************************************/
/*****************************************
// Add a function to determine cloud conditions

var getConditions = function(cloudiness) {
  // var getConditions = (cloudiness) => { }
  var conditions;
  //  ...   ...   ...
  return conditions;
};
******************************************/

// A function to fill out the main-weather Handlebar template
var getWeather = function(theWeather) {
  // var getWeather = (theWeather) => {

  // City label
  $('#results').html(theWeather.city.name); // is .city.name right here???

  // Turn template into html
  var source = $('#main-weather-template').html();

  // Compile template html to Handlebars
  var template = Handlebars.compile(source);

  // Create loop to allow for a flexible number of days for which to retrieve weather data

  // In the API response object, "list" is the key name paired with the weather data.
  for (var i = 1; i < theWeather.list.length; i++) {
    // Get future dates
    var futureDate = futureDate(i);
    var cloudCondition = getConditions(theWeather.list[i].clouds);

    // Weather object for Handlebars
    // SEE myPlay notes
    var weatherObj = {
      now: dayInTheFuture,
      cloudInfo: cloudsCondition.cloudNumber,
      cloudInfoText: cloudsCondition.cloudText
    };

    // Fill template with weatherObj
    var newHTML = template(weatherObj);

    // Append the new html to the page
    $('.page-container').append(newHTML);
  }
};

// A function to call api.openweathermap.com

var APICall = function(theCity) {
  // API url
  var weatherUrl =
    'api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}';

  // API key and an alternate, second key
  var apiKey = 'add32f7253f0ba69178d0ca6ee5ef2b3';

  var apiKeyAlt = '2b2a168d8dac44dd31cfd36829f44f93';

  // Set unit type to imperial
  var unitType = 'imperial';

  // Total number of days for forecast
  var daysTotal = 5; // should this be 5? 6? 7? 8?

  // jQuery API call
};

// Click handler for search bar button
// Make APICall with textarea input
$('#getWeather').on('click', function(e) {
  // Prevent natural form submit event
  e.preventDefault();

  // Ensure search box has value
  // IS THIS TAKEN CARE OF BY "REQUIRED" IN HTML CLASS???
  if (
    $('#city-name')
      .val()
      .trim() === '' ||
    $('#city-name')
      .val()
      .trim() === null
  ) {
    // No action taken if textarea is not filled out
    return;
  } else {
    // Clear the textarea
    $('.section').remove();

    // Get textarea string and invoke APICall function
    var cityName = $('#city-name')
      .val()
      .trim();
    $('#city-name').val('');
    APICall(cityName);
  }
});

/*****************************************
    
  
******************************************/

/*****************************************
 * From openweathermap website: "Better call API by city ID instead of a city name, city coordinates or zip code to get a precise result. The list of cities' IDs is availabe on their site" (JSON file)
  
******************************************/
