var cities = [];

var renderCity = function () {
  $('.cities').empty();

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    var source = $('#city-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city);

    $('.cities').append(newHTML);
  }
};

renderCity();

//url to get lat and lon :      http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=3&appid=9de0841aea702821eece6900aab8d8f1&units=imperial;
//url if lat and lon are known: http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9de0841aea702821eece6900aab8d8f1&units=imperial;
//my guess is that I will need to fetch from the top api and use the property values of lat and long to insert into the bottom api
