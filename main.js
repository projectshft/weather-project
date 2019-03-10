// 1. Get HTML down & libraries rolled out.
// 2. Link HTML to Javascript via jquery
// 3. Get Handlebars in && go through API documentation and gain understanding of what needs to be drawn in and how.
// 5. Get API to pull properly and link files
// 6. Make pretty with Bootstrap && css
// 7. Profit???


var currentWeather = [];
var fiveDayWeather = [];
// my API key & pulls temperature in as fahrenheit because America.
var key = "&units=imperial&appid=0439b3d5de6bee4961a3e1454084792f"


// fetch function that pulls from
var fetch = function(query) {
  $.ajax({
    method: "GET",
    // pulls query
    url: "api.openweathermap.org/data/2.5/weather?q=" + query + key,
    dataType: "json",
    success: function(data) {console.log(data);
      addWeather(weather.items);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// render Weather
var renderWeather = function() {




}




// on click
$('.search').on('click', function() {
  var search = $('#search-query').val(); console.log(search);

  fetch(search);
})
