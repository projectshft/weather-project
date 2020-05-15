//object to model data
var weatherModel = {
  //store currentWeather API data
  currentWeatherData: [],



  //store API key for openweather API
  getApiKey() {
    return '2f39d6282bde1fde1a7949c43e939422';
  },

  addData() {

  },
  
}


var fetchCurrentWeather = function (query) {
  $.ajax({
    method: "GET",
    //REPLACE BOSTON WITH INPUT QUERY ONCE CLICK FUNCTION FOR SEARCH IS COMPLETED
    //REPLACE HARD CODED API KEY WITH WEATHERMODEL GETAPIKEY() FUNCTION;
    url: "https://api.openweathermap.org/data/2.5/weather?q=boston&appid=2f39d6282bde1fde1a7949c43e939422",
    dataType: "json",
    success: function(data) {
      //ADD RETURN DATA TO WEATHER DATA MODEL EX: addFaces(data);
      //RENDER DATA AFTER ADDED TO DATA MODEL EX: renderFaces(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};


//Add user's input values to API query
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});


// var view = {

// }