//API KEY:  APPID {1b7b6777bc5e9df73114043701e7a3d1}
//server: api.openweathermap.org

// AJAX request ONLY every 10 min, even if the call fails

//initialize & declare global variables as needed
var searchQuery;

/* create function for when search button is clicked
that grabs the user value typed in */
var clickSearch = function() {
  searchQuery = ($("#search-query").val());
/* console log see if the clickSearch function
is properly binded to the click event */
  console.log(searchQuery);
};
//use JQUERY to bind search button with click
$('.search').on('click', clickSearch);

//the values that the user inputs should signal to model and pull correct data from the api
//this data should render onto the webpage
// var fetch = function getWeather(query) {
//   $.ajax({
//     method: "GET",
//     url: "http://api.openweathermap.org/data/2.5/weather?id=524901&APPID=1b7b6777bc5e9df73114043701e7a3d1",
//     dataType: "json",
//     data: { q: city },
//     success: function(data) {
//         addBooks(data);
//     }
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     }
//   });
// };
