//model to store data weather that is retrieved from API
var weatherData = [];

//when fetch is called get the serach query from the API
var fetch = function(query) {

  //setting base url for queries
  var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ query.replace(' ', '%20') + "&APPID=40767c2b5aacbb8e4c3a6c5162279cd6"

  $.ajax ({
    method: "GET",
    url:queryUrl,
    dataType: "json",
    success: function (data) {
      addWeather(data);
    },
    error: function (textStatus) {
    console.log(textStatus);
  }
});
};
//take the data returned from the api and then push it to our model array
var addWeather = function(data) {
  weatherData.push(data);
//after data is pushed call a function that renders it
  renderCurrentDay();
};
//using handlebars render the temperature location and weather description to the view
var renderCurrentDay = function() {
  var source = $('#current-weather-template');
  var template = Handlebars.compile(source);
  var newHTML = template({weatherData});

};

//when the search button is clicked the input value from the input is taken and then put into a function to fetch it from the API
$('#search-button').on('click', function() {
  var search = $('#search-query').val();
  if (search !== '') {
    fetch(search);
} else {
    alert("ERROR: Please insert the name of a city");
}
})
