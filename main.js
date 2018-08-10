//Model is both the data and the logic you will use
// only stor data in model.
// only up date when events(client) changes it.
var city = [];
var weather= [];




//View What the user see rendered to the screen
//only update view in repsonse to changes in model
// Can be considered the UI

var renderCity = function(){
  
};






//Controller Handles Events. Takes in info from UI
// and processes it to change the Model.

// Search button click handler
$('#search-button').on('click', function () {

  var town = $('.city-search').val();
  city.push(town);
  //clears the search box
  $('.city-search').val('');

});
