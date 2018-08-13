//weatherInfo will be the data structure that holds the stats for each city
var weatherInfo = [];

/* =============================
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

$('.search-btn').on('click', function(e) {
  e.preventDefault();
  var $cityInput = $('.city-input').val();
  console.log('city:' + $cityInput)
  fetch($cityInput);
});

var fetch = function($cityInput) {
  var urlEnd = $cityInput + "&APPID=f386691c0cd26a16742b12643c9b113e&units=imperial";


  //call API for 5 day forecast weather

  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + urlEnd,
    dataType: "json",
    success: function(data) {
      console.log('successful API request 2');
      console.log(data);
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

};

//addweather function is invoked whenever the ajax function returns a successful api call.  addWeather passes in the data returned with that api call.
var addWeather = function(data) {

  //data is pushed into the dataArr so that it can be evaluated in the for loop below
  var dataArr = [];
  dataArr.push(data);

  //city() searches the data for the name of the city
  var city = function() {
    if (dataArr[0].city.name) {
      console.log('the city function returns' + dataArr[0].city.name);
      return dataArr[0].city.name;
    } else {
      return null;
    }
  };
  //loop through all the data that came back from the API, build individual current weather objects with the data we need and push it to the weatherInfo array.
  for (var day = 3; day < dataArr[0].list.length; day += 8) {

    var date = function() {
      if (dataArr[0].list[day].dt) {
        var weekday = moment.unix(dataArr[0].list[day].dt).format("dddd");
        console.log('the temp function returns ' + weekday);
        return weekday;
      } else {
        return null;
      }
    };

    //temp() searches data for current temp
    var temp = function() {
      if (dataArr[0].list[day].main.temp) {
        console.log('the temp function returns ' + dataArr[0].list[day].main.temp);
        var degrees = dataArr[0].list[day].main.temp;
        return Math.round(degrees);
      } else {
        return null;
      }
    };

    //condition() searches data for current condition
    var condition = function() {
      if (dataArr[0].list[day].weather[0].main) {
        console.log('the city function returns ' + dataArr[0].list[day].weather[0].main);
        return dataArr[0].list[day].weather[0].main;
      } else {
        return null;
      }
    };

    //description() searches data description of weather
    var description = function() {
      if (dataArr[0].list[day].weather[0].description) {
        console.log('the city function returns ' + dataArr[0].list[day].weather[0].description);
        return dataArr[0].list[day].weather[0].description;
      } else {
        return null;
      }
    };

    //icon() searches data description of weather
    var iconImg = function() {
      if (dataArr[0].list[day].weather[0].icon) {
        var iconNum = dataArr[0].list[day].weather[0].icon;
        var iconImg = "http://openweathermap.org/img/w/" + iconNum + ".png";
        console.log(iconImg);
        return iconImg;
      } else {
        return null;
      }
    };

    //cityWeatherInfo is an object that calls functions that are set to values of properties that will eventually manipulate the html
    var cityWeatherInfo = {
      city: city(),
      date: date(),
      temp: temp(),
      condition: condition(),
      description: description(),
      iconImg: iconImg()
    };

    //make sure there is no data already in weatherInfo array
    // weatherInfo.length = 0;

    //push the cityWeatherInfo object into the weatherInfo array
    weatherInfo.push(cityWeatherInfo);
    //log the weatherInfo array to test that it contains the desired data
    console.log(weatherInfo);
  };

  //invoke the renderWeather function
  renderWeather();
};

//the renderWeather function will iterate through theweather array and add the weather info to the page.
var renderWeather = function() {
  //first empty out weather div to make sure page matches what is in the weatherInfo array
  $('.weather').empty();

  //fill out the current-weather-template
  var renderCurrent = function() {
    var cwSource = $('#current-weather-template').html();
    var cwTemplate = Handlebars.compile(cwSource);
    var cwContext = ({
      "city": weatherInfo[0].city,
      "current-temp": weatherInfo[0].temp,
      "current-description": weatherInfo[0].description,
      "current-iconImg" : weatherInfo[0].iconImg,
    });
    var cwHTML = cwTemplate(cwContext);
    //once template is compiled with weather info, append the forecast to the weather div
    $('.current-weather').html(cwHTML);
  };
  renderCurrent();

  //fill out the upcoming-weather template and append it to the weather div in the html
 $(function() {
    //compile handlebars template
    //template's script in the html doc is set with help that says for each {{}} in the weatherInfo array create a new template of weatherInfo
    var source = $('#upcoming-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherInfo);

    //once template is compiled with weather info, append the forecast to the weather div
    $('.upcoming-weather').html(newHTML);
  });
};
