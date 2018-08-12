
/* first, build out the front-end: get page set up to take in the weather information for cities that the API will retrieve. render a couple hard-coded cities to test */

//weatherInfo will be the data structure that holds the stats for each city
var weatherInfo = [];

  //the renderWeather function will iterate through theweather array and append the weather info to the page.
    var renderWeather = function () {
    //first empty out weather div to make sure page matches what is in the weatherInfo array
    $('.weather').empty();
    //loop through weatherInfo arr in order to fill outthe weather template and append it to the weather div in the html
    for (var arr = 0; arr < weatherInfo.length; arr++){
      //compile handlebars template
        var source = $('#weather-template').html();
        var template = Handlebars.compile(source);

        //***TO DO ***
        //****template will not compile data whose valuerepresents an object as the value of the array(ex: arr.main.temp)
        //**** will need to either create additional forloops to find this data or find another way.

        var forecast = template(
          {city:weatherInfo[arr].name, temp:weatherInfo[arr].main.temp, condition:weatherInfo[arr].weather.condition, description:weatherInfo[arr].weather.description});

      //once template compiles a forecast into thehandlebars template, append the forecast to theweather div
        $('.weather').append(forecast);
    };
  };

  /* Next =============================
  - get input when a user clicks search
  - make a GET request from the open Weather Map API to get info about city
  - put data into weatherInfo array
  -invoke renderWeather
   ====================================*/

//click event handler responds when search button is clicked
  //1-cancels default sumbit just in case this is every changed, etc.
  //2-gets the value of the element with class of city-input and sets them to variable for later use
  //3-***delete after testing** console.log to make sure the value is correct
  //4- invoke the fetch function with the value from above passed in as a parameter

  $('.search-btn').on('click', function (e) {
    e.preventDefault();
    var $cityInput = $('.city-input').val();
    fetch($cityInput);
    });

var fetch = function ($cityInput) {

  var urlEnd = $cityInput + "&APPID=" + "f386691c0cd26a16742b12643c9b113e";

  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + urlEnd,
    dataType: "json",
    success: function(ret) {
    addWeather(ret);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });


  var addWeather = function (ret) {

  weatherForecast = [];

  for (var indx = 0; indx < ret.length; indx++) {
    var city = function () {
      if (ret[indx].name) {
        return ret[indx].name;
      } else {
        return null;
      }
    };

    var temp = function () {
      if (ret[indx].list.main.temp) {
        alert(ret[indx].main.temp);
        return ret[indx].main.temp;
      } else {
        return null;
      }
    };

    var condition = function () {
      if (ret[indx].weather.id) {
        return ret[indx].weather.id;
      } else {
        return null;
      }
    };

    var description = function () {
      if (ret[indx].weather.description) {
        return ret[indx].weather.description;
      } else {
        return null;
      }
    };

    var cityForecast = {
      city: city(),
      temp: temp(),
      condition: condition(),
      description: description(),
    };
    weatherForecast.push(cityForecast);

  };

  weatherInfo.push(weatherForecast);
  };
  renderWeather();
  };
