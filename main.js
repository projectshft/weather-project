/* first, build out the front-end: get page set up to take in the weather information for cities that the API will retrieve. render a couple hard-coded cities to test */

//weatherInfo will be the data structure that holds the stats for each city
var weatherInfo = [
  {
      "coord": {
        "lon": -0.13,
        "lat": 51.51
      },
      "weather": [{
        "id": 300,
        "main": "Drizzle",
        "description": "light intensity drizzle",
        "icon": "09d"
      }],
      "base": "stations",
      "main": {
        "temp": 280.32,
        "pressure": 1012,
        "humidity": 81,
        "temp_min": 279.15,
        "temp_max": 281.15
      },
      "visibility": 10000,
      "wind": {
        "speed": 4.1,
        "deg": 80
      },
      "clouds": {
        "all": 90
      },
      "dt": 1485789600,
      "sys": {
        "type": 1,
        "id": 5091,
        "message": 0.0103,
        "country": "GB",
        "sunrise": 1485762037,
        "sunset": 1485794875
      },
      "id": 2643743,
      "name": "London",
      "cod": 200
    }
    ];

    //the renderWeather function will iterates through the weather array and append the weather info to the page.

    var renderWeather = function () {
      //first empty out weather div to make sure page matches what is in the weatherInfo array
      $('.weather').empty();

      //loop through weatherInfo arr in order to fill out the weather template and append it to the weather div in the html
      for (var arr = 0; arr < weatherInfo.length; arr++){
        //compile handlebars template
          var source = $('#weather-template').html();
          var template = Handlebars.compile(source);

          //***TO DO ***
          //****template will not compile data whose value represents an object as the value of the array (ex: arr.main.temp)
          //**** will need to either create additional for loops to find this data or find another way.

          var forecast = template({city: weatherInfo[arr].name, currentTemp: weatherInfo[arr].main.temp, condition: weatherInfo[arr].weather.main, description: weatherInfo[arr].weather.description});

        //once template compiles a forecast into the handlebars template, append the forecast to the weather div
          $('.weather').append(forecast);
      };
    };
