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

  $('.search-btn').on('click', function (e) {
    e.preventDefault();
    alert('clicked!')
    var $cityInput = $('.city-input').val();
    console.log('city:' + $cityInput)
    fetch($cityInput);
    });

    var fetch = function ($cityInput) {
      var urlEnd = $cityInput + "&APPID=f386691c0cd26a16742b12643c9b113e&units=imperial";

      $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + urlEnd,
        dataType: "json",
        success: function(data) {
        alert('successful API request');
        console.log(data);
        addWeather(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    };

//loop through all the data that came back from the API, build individual current weather objects with the data we need and push it to the weatherInfo array.
    var addWeather = function(data){
      var dataArr = [];
      dataArr.push(data);

      for(var obj = 0; obj < dataArr.length; obj++){

        var city = function(){
          if(dataArr[obj].name){
          alert('the city function returns' + dataArr[obj].name);
          return dataArr[obj].name;
        } else {
          return null;
        }
      };

      var temp = function(){
        if(dataArr[obj].main.temp){
        alert('the temp function returns ' + dataArr[obj].main.temp);
        return dataArr[obj].main.temp;
      } else {
        return null;
      }
    };

    var condition = function(){
      if(dataArr[obj].weather[0].main){
      alert('the city function returns' + dataArr[obj].weather[0].main);
      return dataArr[obj].weather[0].main;
    } else {
      return null;
    }
  };

  var description = function(){
    if(dataArr[obj].weather[0].description){
    alert('the city function returns' + dataArr[obj].weather[0].description);
    return dataArr[obj].weather[0].description;
  } else {
    return null;
  }
};

city();
temp();
condition();
description();
};


      //make sure there is no data already in weatherInfo array
      weatherInfo.length = 0;

      //push data from api call into weatherInfo array
      //****log it for test
      weatherInfo.push(data);
      console.log('data pushed:' + data);

      //invoke the renderWeather function
      renderWeather();
    };


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

            var context = ({"name" : weatherInfo[arr].name, "temp" : weatherInfo[arr][0].main.temp, "condition" : weatherInfo[arr][0].weather[0].main, "description" : weatherInfo[arr][0].weather[0].description});

            var newHTML = template(context);

          //once template compiles a forecast into thehandlebars template, append the forecast to the weather div
            $('.weather').append(newHTML);
        };
      };
