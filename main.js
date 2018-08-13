//API KEY:  APPID {1b7b6777bc5e9df73114043701e7a3d1}
//server: api.openweathermap.org
// "http://api.openweathermap.org/data/2.5/weather?q=durham,us&APPID=1b7b6777bc5e9df73114043701e7a3d1"

//initialize & declare global variables as needed
var searchQuery;
/* create function for when search button is clicked
that grabs the user value typed in */
var clickSearch = function() {
  searchQuery = ($("#search-query").val());
// /* console log to see if the clickSearch function
// is properly binded to the click event */
  console.log(searchQuery);
  fetch();
};
//use JQUERY to bind search button with click
$('.search').on('click', clickSearch);

//the values that the user inputs should signal to model and pull correct data from the api
//this data should render onto the webpage
var fetch = function (clickSearch) {
  $.ajax({
    method: "GET",
    // url currently grabs the user's search query and connects the ajax call
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchQuery + "&APPID=1b7b6777bc5e9df73114043701e7a3d1",
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  });
};


// $('.current-weather').append(clickSearch);
