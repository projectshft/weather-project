/* Alright. So, here's where I need to start.

I'm trying to remember at the beginning, what you need to do to get an
API off the ground. I'm going to need to get things into a handlebars
template. and so forth.

*/

// Search only US cities. Sean made that clarificaiton
// Although I supposed, based on user input, we could go based on
// country code... there could be if statements

// Should I make this an array or an object?
// I'll do an array for now... good practice for future forecast.
var currentWeather = [];
var fiveDayForecast = [];

var setCurrentWeather = function(data) {

  currentWeather = [];

  for (var i = 0; i < data.items.length; i++) {

    var book = {title: "", author: '', imageURL: '', isbn: '', pageCount: null};

    book.title = data.items[i].volumeInfo.title;

    book.author = data.items[i].volumeInfo.authors;

    book.pageCount = data.items[i].volumeInfo.pageCount;

    //book.isbn = data.items[i].volumeInfo.industryIdentifiers[0].identifier;

    book.isbn = data.items[i].volumeInfo.industryIdentifiers ? data.items[i].volumeInfo.industryIdentifiers[0].identifier : null;


    book.imageURL = data.items[i].volumeInfo.imageLinks ? data.items[i].volumeInfo.imageLinks.thumbnail : null;

    books.push(book);
  }

renderWeather();

};

// I will likely need some sort of "wait" or "setTimeOut Function"
// To time the API returns right.
// This is part of the view...
// At some point, I will want to refactor this to reflect
// A larger design pattern. Right now, view knows something about model
var renderWeather = function() {
  $('.weather').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < currentWeather.length; i++) {
    var displayCurrentWeather = template(currentWeather[i]);
    $('.weather').append(displayCurrentWeather);
  }
};

// This function is getting all the weather data for the entered City
// And will add it to our array. This is the Model doing its thing
// pure Model right now.
var fetch = function (query) {

  $.ajax({
    method: "GET",
    //hardcoding API query for testing purposes. Note I've chosen to use imperial units haha.
    // Also, the query will only replace city,state for the time being.
    url: "http://api.openweathermap.org/data/2.5/weather?q=Durham,nc,us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8",
    dataType: "json",
          // Commenting out loading icon for the time being
    // beforeSend: function() {
    //   $(".text-center").show();
    // },
    success: function(data) {
      alert('I worked!')
      // $(".text-center").hide();
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// This is controller.
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});
