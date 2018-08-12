
//This will fetch the weather data from the weather API and pass that data to the addWeather function
var fetch = function(search) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=London,uk&APPID=918ac6da646e8abb007466773f439122",
    dataType: "json",
    success: function(data) {
      console.log('City weather data retrieved')
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}
//an array that will store the appropriate weather data
var weather = [];
//This function is looping through the retrieved data from the weather API then return the needed data to the array
var addWeather = function (data){
  console.log('add weather function accessed');
  for(var i = 0; i < data.list.length; i++){
    var weatherData = data.list[i];
    console.log(weatherData);
  }
};

//renderWeather will render the data from the array to the view
var renderWeather = function() {

}
//Making an event handler to retrieve user input
$('.search').on('click', function(){
  var search = $('.search').val();
  console.log('clicked search button');
  fetch(search);
})
