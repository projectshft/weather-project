//model to store data weather that is retrieved from API
var weatherData = [];

//when the search button is clicked the input value from the input is taken and then put into a function to fetch it from the API
$('#search-button').on('click', function() {
  var search = $('#search-query').val();
  if (search !== '') {
    fetch(search);
} else {
    alert("ERROR: Please insert the name of a city");
}
})
