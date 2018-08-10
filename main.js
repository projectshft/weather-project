/* first, build out the front-end: get page set up to take in the weather information for cities that the API will retrieve. render a couple hard-coded cities to test */

//weatherInfo will be the data structure that holds the stats for each city
var weatherInfo = [{
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
    ];

    //the renderWeather function will iterates through the weather array and append the weather info to the page.

    var renderWeather = function () {
      //first empty out weather div to make sure page matches what is in the weatherInfo array
      $('.weather').empty();

      //loop through weatherInfo arr in order to fill out the weather template and append it to the weather div in the html
      for (var arr = 0; arr < weatherInfo.length; arr++){

      }
    }
