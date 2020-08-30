const WeatherProject = function () {
  let cityCurrentWeatherArray = [];
  let cityFiveDayWeatherArray = [];
  let todayNumber = '';

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const clearDataArraysAndDisplay = () => {
    //array and display clearing
    cityCurrentWeatherArray = [];
    cityFiveDayWeatherArray = [];
    $('#currentWeatherData').empty();
    $('#fiveDayWeatherData').empty();
  };

  const findTodayNumber = (todayUNIXStamp) => {
    console.log('finding today!');

    //Convert the UNIX stamp that was generated on button click to
    //a number that represents day of the week (0-6).
    const aDateAndTimeStamp = new Date(todayUNIXStamp);
    todayNumber = Number(aDateAndTimeStamp.getDay());
  };

  const fetchData = (userInputCity) => {
    console.log('fetching data!');

    //Run first ajax GET method to retrieve current weather data
    $.ajax({
      method: 'GET',
      url:
        `https://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=1223294114fb8930caf177ea3451f02c`,
      dataType: 'json',
      success: function (currentWeatherJSONData) {
        //If successful, send results to be parsed, added to an array
        //and then sent to be rendered
        addCurrentWeatherDataToArray(currentWeatherJSONData);

        //If successful, retrieve five day forecast
        $.ajax({
          method: 'GET',
          url:
            `https://api.openweathermap.org/data/2.5/forecast?q=${userInputCity}&appid=1223294114fb8930caf177ea3451f02c`,
          dataType: 'json',
          success: function (fiveDayWeatherJSONData) {
            console.log('successfully retrieved five day data!');
            //If successful, send results to be parsed, added to an array
            //and then sent to be rendered
            addFiveDayWeatherDataToArray(fiveDayWeatherJSONData);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert('Unable to retrieve 5-day forecast for this city');
          },
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(
          'Please enter a city name with correct spelling and spacing. \nYou can use upper or lower case.'
        );
      },
    });
  };

  const addCurrentWeatherDataToArray = (currentWeatherJSONData) => {
    console.log('adding current data to array!');

    //Convert temp returned in Kelvin to F
    const fahrenheitFromKelvin = Math.floor(
      currentWeatherJSONData.main.temp / 3.493
    );
    //Create current weather object and add to array
    const newCityAndWeatherCurrentDataObject = {
      city: currentWeatherJSONData.name,
      temp: fahrenheitFromKelvin,
      description: currentWeatherJSONData.weather[0].description,
      weatherIconSrc:
        'http://openweathermap.org/img/wn/' +
        currentWeatherJSONData.weather[0].icon +
        '@2x.png',
    };
    cityCurrentWeatherArray.push(newCityAndWeatherCurrentDataObject);

    // send data to be rendered on the page
    renderCurrentWeather(cityCurrentWeatherArray);
  };

  const renderCurrentWeather = (cityCurrentWeatherArray) => {
    console.log('rendering current weather!');

    //We know our array contains only 1 item for current weather, so no loop is necessary
    //Prepare handlebars template
    const weather = cityCurrentWeatherArray[0];
    const source = $('#current-weather-template').html();
    const template = Handlebars.compile(source);
    const weatherHTML = template(weather);
    //Append data to handlebars template; clear data entry field
    $('#currentWeatherData').append(weatherHTML);
    $('#cityName').val('');
  };

  const addFiveDayWeatherDataToArray = (fiveDayWeatherJSONData) => {
    console.log('adding five day data to array!');

    //convert the retrieved five day weather's date-time stamp to a numeric day of the week (0-6)
    //and to full text day (Sun-Sat)
    for (let i = 0; i < fiveDayWeatherJSONData.list.length; i++) {
      const dateLongFormatText = new Date(
        fiveDayWeatherJSONData.list[i].dt_txt
      );
      const dayNumberOfTheWeek = Number(dateLongFormatText.getDay());
      const dayOfTheWeekSpelledOut = days[dateLongFormatText.getDay()];

      //Convert temp returned in Kelvin to F
      const fahrenheitFromKelvinFiveDay = Math.floor(
        fiveDayWeatherJSONData.list[i].main.temp / 3.493
      );

      //Parse data into object
      const newCityAndWeatherFiveDay = {
        weekdayNumber: dayNumberOfTheWeek,
        weekdayFull: dayOfTheWeekSpelledOut,
        temperature: fahrenheitFromKelvinFiveDay,
        briefDescription: fiveDayWeatherJSONData.list[i].weather[0].main,
        weatherIcon: fiveDayWeatherJSONData.list[i].weather[0].icon,
        weatherIconSrc:
          'http://openweathermap.org/img/wn/' +
          fiveDayWeatherJSONData.list[i].weather[0].icon +
          '.png',
      };

      // Add the object to the five day weather array
      cityFiveDayWeatherArray.push(newCityAndWeatherFiveDay);
    }
    console.log('out of five day object creation loop!');
    renderFiveDayWeather(cityFiveDayWeatherArray);
  };

  const renderFiveDayWeather = (cityFiveDayWeatherArray) => {
    console.log('rendering five day weather!');
    //A new array to hold upcoming five days of weather data
    const fiveDaysOfWeather = [];

    //Find upcoming 5 days by comparing day numbers (0-6) against 'today' value
    //to grab, essentially, today+1 = tomorrow, etc.
    const dayOne = cityFiveDayWeatherArray.find(function (days) {
      if (todayNumber === 6) {
        return days.weekdayNumber === 0;
      } else {
        return days.weekdayNumber === todayNumber + 1;
      }
    });
    fiveDaysOfWeather.push(dayOne);

    const dayTwo = cityFiveDayWeatherArray.find(function (days) {
      if (todayNumber === 5) {
        return days.weekdayNumber === 0;
      } else if (todayNumber === 6) {
        return days.weekdayNumber === 1;
      } else {
        return days.weekdayNumber === todayNumber + 2;
      }
    });
    fiveDaysOfWeather.push(dayTwo);

    const dayThree = cityFiveDayWeatherArray.find(function (days) {
      if (todayNumber === 4) {
        return days.weekdayNumber === 0;
      } else if (todayNumber === 5) {
        return days.weekdayNumber === 1;
      } else if (todayNumber === 6) {
        return days.weekdayNumber === 2;
      } else {
        return days.weekdayNumber === todayNumber + 3;
      }
    });
    fiveDaysOfWeather.push(dayThree);

    const dayFour = cityFiveDayWeatherArray.find(function (days) {
      if (todayNumber === 3) {
        return days.weekdayNumber === 0;
      } else if (todayNumber === 4) {
        return days.weekdayNumber === 1;
      } else if (todayNumber === 5) {
        return days.weekdayNumber === 2;
      } else if (todayNumber === 6) {
        return days.weekdayNumber === 3;
      } else {
        return days.weekdayNumber === todayNumber + 4;
      }
    });
    fiveDaysOfWeather.push(dayFour);

    const dayFive = cityFiveDayWeatherArray.find(function (days) {
      if (todayNumber === 2) {
        return days.weekdayNumber === 0;
      } else if (todayNumber === 3) {
        return days.weekdayNumber === 1;
      } else if (todayNumber === 4) {
        return days.weekdayNumber === 2;
      } else if (todayNumber === 5) {
        return days.weekdayNumber === 3;
      } else if (todayNumber === 6) {
        return days.weekdayNumber === 4;
      } else {
        return days.weekdayNumber === todayNumber + 5;
      }
    });
    fiveDaysOfWeather.push(dayFive);

    //Prepare handlebars template and append data
    const source = $('#five-day-weather-template').html();
    const template = Handlebars.compile(source);
    for (let i = 0; i < fiveDaysOfWeather.length; i++) {
      const weatherHTML = template(fiveDaysOfWeather[i]);
      $('#fiveDayWeatherData').append(weatherHTML);
    }
  };

  return {
    clearDataArraysAndDisplay: clearDataArraysAndDisplay,
    findTodayNumber: findTodayNumber,
    addCurrentWeatherDataToArray: addCurrentWeatherDataToArray,
    renderCurrentWeather: renderCurrentWeather,
    addFiveDayWeatherDataToArray: addFiveDayWeatherDataToArray,
    renderFiveDayWeather: renderFiveDayWeather,
    fetchData: fetchData,
  };
};

const app = WeatherProject();

//Event
$('.search').on('click', function () {
  //clear existing arrays and displayed data
  app.clearDataArraysAndDisplay();

  //grab timestamp to convert to 'today'
  const todayUNIXStamp = Date.now();
  app.findTodayNumber(todayUNIXStamp);

  //grab user's city input and send it to fetch weather data
  const userInputCity = $('#cityName').val();
  app.fetchData(userInputCity);
});

//API Key for google map embed: AIzaSyA7Psn-v_cbiWLDMaWS04XEgjMUdZjx3g4