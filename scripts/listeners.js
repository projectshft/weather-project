//initiallize a query variable that can be used in the default click listener
var query = '';
//initialize lat and long variables to be used by the Current Location listener
var lat = 0;
var long = 0;
//define a check for default function
var checkDefault = function(){
  if (localStorage.default != null && localStorage.default != '') {
    //current weather GET
    currentWeatherFetch(localStorage.default);
    //forecast GET
    forecastFetch(localStorage.default);
  };
};
//invoke and check for default in local storage
checkDefault();
//add the event listener for the searched city
$(".btn-search").click(function() {
  query = $(".search-query").val();
  $(".search-query").val('');
  //current weather GET
  currentWeatherFetch(query);
  //forecast GET
  forecastFetch(query);
});
//add listner to set Default
$(".btn-set-default").click(function() {
  localStorage.default = query;
  console.log(localStorage);
});
//add listener to send current location GET
$(".btn-current-location").click(function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    lat = Math.floor(position.coords.latitude);
    long = Math.floor(position.coords.longitude);
    console.log('lat: ', lat);
    console.log('long: ', long);
    currentWeatherFetch(null, lat, long);
    forecastFetch(null, lat, long);
  });
});
