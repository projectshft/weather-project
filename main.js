/************************************************************************
 *
 * Alice Tung  |  Eval #3  |  Weather Project
 * 
 * A web application that displays the current weather and 5-day forecast
 * 
 ************************************************************************/

// TODO:
// Find bootstrap template for weather app
// Look back at week's material
// Set up pseudocode
// Check API key account activated
// Download moment.js
// Refer to book-shelf project
// npm install node_modules


/*****************************************************************************
 * 
 * CURRENT WEATHER SECTION
 * 
 *****************************************************************************/

// Declare empty array to contain the current weather data retrieved from API
var currentWeatherDataObj = [];

// Function renders current weather data to the DOM
var renderCurrentWeatherDataView = function () {
    $('.currentWeatherView').empty();
    
    // Iterates through each property and attribute in the current weather data
    // and writes it into Handlebars template, then rendered to the DOM
    for (var i = 0; i < currentWeatherDataObj.length; i++) {
      var currentWeatherDataView = currentWeatherDataObj[i];

      var source = $('#currentWeather-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(currentWeatherDataView);
    
      $('.currentWeatherView').append(newHTML);
    }
  };

renderCurrentWeatherDataView();


// Retrieve API data for current weather in a user-specified US city, in imperial units
var fetch = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",us&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d",
      dataType: "json",
      success: function(data) { //console.log(data)

        setCurrentWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

// Reference for API format: api.openweathermap.org/data/2.5/weather?q=London,uk&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d

// Store user input in search variable    
$('.search').on('click', function () 
{
    var search = $('#search-query').val();
        //console.log(search);
    fetch(search);
});


// Information required to display current weather is extracted from retrieved API,
// stored in currentWeatherDataObj array, then rendered to the DOM
var setCurrentWeather = function(data)
{
    currentWeatherDataObj = [];

    var currentWeatherData = data;

   
        var city = function()
        {
            if (currentWeatherData.name)
            {
                return currentWeatherData.name;
            }
            else
            {
                return null;    
            }
        };
    
        var condition = function()
        {
            if (currentWeatherData.weather)
            {         
                return currentWeatherData.weather[0].description;
            }
            else
            {
                return null;    
            }      
        };

        var temperature = function()
        {
            if (currentWeatherData.main)
            {         
                return currentWeatherData.main.temp;
            }
            else
            {
                return null;    
            }      
        };
    

    var currentWeatherData = 
    {
        city: city(),
        condition: condition(),
        temperature: temperature().toFixed() // Round to nearest ones place
    };

    currentWeatherDataObj.push(currentWeatherData); //console.log(currentWeatherDataObj);

    renderCurrentWeatherDataView();
}
