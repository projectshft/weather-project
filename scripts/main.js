// //make model to store current city and listen for changes
// var CurrentCityModel = function(searchValue){
//   //initialize data container for the searched value
//   var attributes = {};
//
//   var changeCallback = null;
//
//   var init = function(){
//     Object.assign(attributes, searchValue);
//   };
//
//   var set = function(key, value){
//     var temporaryObject = Object.assign({}, attributes);
//
//     temporaryObject[key] = searchValue;
//
//     if(!_.isEqual(attributes, temporaryObject)) {
//       attributes[key] = value;
//
//       if (changeCallback) {
//         changeCallback();
//       };
//     };
//   };
//
//   var get = function(key){
//     return attributes[key];
//   };
//
//   var change = function(f){
//     changeCallback = f;
//   };
//
//   var getAttributes = function() {
//     return attributes;
//   };
//
//   init();
//
//   return {set, get, change, getAttributes};
// };
//
// var CurrentCityView = function(citySearchModel, template){
//   var render = function(){
//     var city = citySearchModel.getCity();
//     return template(city);
//   };
//   return {render};
// };

//fetch the current weather for the searched city
var currentWeatherFetch = function(query) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${query},usa&APPID=e5c41b556e0f143b4f3f8ea018a675ca`,
    dataType: "json",
    success: function(data) {
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//add the event listener for the searched city
$(".btn-search").click(function() {
  var queryCity = $(".search-query").val();
  var query = $(".search-query").val();
  currentWeatherFetch(query);

  // var searchModel = CurrentCityModel({ :, :})
  //
  // var template = Handlebars.compile($("").html());
  //
  // var searchView = CurrentCityView(searchModel, template);
  //
  // searchModel.change(function(){
  //   seachView.render();
  // })
});
