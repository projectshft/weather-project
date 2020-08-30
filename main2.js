

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
    cityCurrentWeatherArray = [];
    cityFiveDayWeatherArray = [];
    $('#currentWeatherData').empty();
    $('#fiveDayWeatherData').empty();
  };
    
  const findTodayNumber = (todayUNIXStamp) => {
    console.log('finding today!');
    // console.log(fiveDayData); //along for the ride

    //Convert the UNIX stamp that was generated on button click to
    //a number that represents day of the week (0-6).
    const aDateAndTimeStamp = new Date(todayUNIXStamp);
    todayNumber = Number(aDateAndTimeStamp.getDay());
    // addFiveDayWeatherDataToArray(fiveDayData, todayNumber);
  };

  const addCurrentWeatherDataToArray = (currentWeatherJSONData) => {
    console.log('adding current data to array!');
    // console.log(currentData);

    //Convert temp returned in Kelvin to F
    const fahrenheitFromKelvin = Math.floor(
      currentWeatherJSONData.main.temp / 3.493
    );
    //Create current weather object
    const newCityAndWeatherCurrentData = {
      city: currentWeatherJSONData.name,
      temp: fahrenheitFromKelvin,
      description: currentWeatherJSONData.weather[0].description,
      weatherIconSrc:
        'http://openweathermap.org/img/wn/' +
        currentWeatherJSONData.weather[0].icon +
        '@2x.png',
    };

    //Push to array
    cityCurrentWeatherArray.push(newCityAndWeatherCurrentData);

    //send data to be rendered on the page
    renderCurrentWeather(cityCurrentWeatherArray);
  };

  const renderCurrentWeather = (cityCurrentWeatherArray) => {
    console.log('rendering current weather!');
    console.log(cityCurrentWeatherArray);

    //Clear the existing data on the page
    $('#currentWeatherData').empty();

    //We know our array contains only 1 item for current weather, so no loop is necessary
    //Prepare handlebars template
    let weather = cityCurrentWeatherArray[0];
    const source = $('#current-weather-template').html();
    const template = Handlebars.compile(source);
    const weatherHTML = template(weather);
    //Push data to handlebars template; clear data entry field and weather array
    $('#currentWeatherData').append(weatherHTML);
    $('#cityName').val('');
    cityCurrentWeatherArray = [];
  };

  const addFiveDayWeatherDataToArray = (fiveDayWeatherJSONData) => {
    console.log('adding five day data to array!');
    // console.log(today);
    for (let i = 0; i < fiveDayWeatherJSONData.list.length; i++) {
      //convert the imported date-time stamp to a day of the week
      const dateLongFormatText = new Date(
        fiveDayWeatherJSONData.list[i].dt_txt
      );
      const dayOfTheWeekLong = days[dateLongFormatText.getDay()];
      const dayNumberOfTheWeek = Number(dateLongFormatText.getDay());

      //Convert temp returned in Kelvin to F
      const fahrenheitFromKelvinFiveDay = Math.floor(
        fiveDayWeatherJSONData.list[i].main.temp / 3.493
      );

      // add brief weather description
      const briefWeatherDesc = fiveDayWeatherJSONData.list[i].weather[0].main;

      const newCityAndWeatherFiveDay = {
        weekdayNumber: dayNumberOfTheWeek,
        weekdayFull: dayOfTheWeekLong,
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
    console.log('outofloop');
    console.log(cityFiveDayWeatherArray);
    renderFiveDayWeather(cityFiveDayWeatherArray);
  };

  const renderFiveDayWeather = (cityFiveDayWeatherArray) => {
    console.log('rendering five day weather!');
    let fiveDaysOfWeather = [];

    const dayOne = cityFiveDayWeatherArray.find(function (days) {
      if (todayNumber === 6) {
        return days.weekdayNumber === 0;
      } else {
        return days.weekdayNumber === todayNumber + 1;
      }
    });
    console.log(dayOne);
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
    console.log(dayTwo);
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
    console.log(dayThree);
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
    console.log(dayFour);
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
    console.log(dayFive);
    fiveDaysOfWeather.push(dayFive);

    //Clear the existing data on the page
    $('#fiveDayWeatherData').empty();
    //Prepare handlebars template
    const source = $('#five-day-weather-template').html();
    const template = Handlebars.compile(source);

    //Push data to handlebars template, clear data array.
    for (let i = 0; i < fiveDaysOfWeather.length; i++) {
      const weatherHTML = template(fiveDaysOfWeather[i]);
      $('#fiveDayWeatherData').append(weatherHTML);
    }
    cityFiveDayWeatherArray = [];
  };

  const fetchData = (userInputCity) => {
    console.log('fetching data!');

    //Run first ajax GET method for current weather data
    $.ajax({
      method: 'GET',
      url:
        'https://api.openweathermap.org/data/2.5/weather?q=' +
        userInputCity +
        '&appid=1223294114fb8930caf177ea3451f02c',
      dataType: 'json',
      success: function (currentWeatherJSONData) {
        //If successful, send results to a function that will add them
        //to a current weather array
        addCurrentWeatherDataToArray(currentWeatherJSONData);
        //If successful, retrieve five day forecast
        $.ajax({
          method: 'GET',
          url:
            'https://api.openweathermap.org/data/2.5/forecast?q=' +
            userInputCity +
            '&appid=1223294114fb8930caf177ea3451f02c',
          dataType: 'json',
          success: function (fiveDayWeatherJSONData) {
            console.log('successfully retrieved five day data!');
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
