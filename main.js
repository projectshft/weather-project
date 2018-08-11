$(document).ready(function() {

  //create click handler for search button
  $('#search-button').click(function() {
    console.log('button clicked!');

    //get user input from search query
    var userInputCity = $('#search-query').val();
    console.log(userInputCity);
    //display results from user input
    $('#city').html(userInputCity);
    //get results from weather api

    //display current forecast from weather api

    //display 5-day forcst with results weather api

  })
})

var fetch = function (query) {

};

var addBooks = function (data) {

};


var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?q=hunger+games",
    dataType: "json",
    success: function(data) {
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
