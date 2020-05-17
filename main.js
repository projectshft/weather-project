//create an object that will hold the data from the weather api for the current day and weekly forecast
const WeatherModule = () => {


  //this object will hold an object for the current weather and an array of day objects for the 5 day forecast. 
  const forecastObject = {};

  /* an example of what this object will look like this after data is inserted:

  forecastObject = {
    currentForecast: {
      temperature: 70
      city: 'Raleigh'
      condition: 'Clouds'
      weatherIconURL: `http://openweathermap.org/img/....'
    },

    weekdayForecast: [
     {
       weekday: 'Monday' 
       avgTemp: 70
       city: 'Raleigh'
       condition: 'Clouds'
       weatherIconURL: `http://openweathermap.org/img/....'
     },...
   ]
  }
*/

  //create a function that will use handlebars to take the infomation in the forecastObject and append it to the page
  const renderWeather = () => {
    $('.current-weather').empty();
    $('.week-forecast').empty();

    currentWeatherSource = $('#current-day-template').html();
    const currentTemplate = Handlebars.compile(currentWeatherSource);
    const newCurrentWeatherHTML = currentTemplate(forecastObject.currentWeather);
    $('.current-weather').append(newCurrentWeatherHTML);

    //the weekdayForecast will be an array of daily forecasts, so we must loop through that and create template/append new html for each day
    for (let i = 0; i < forecastObject.weekdayForecast.length; i++) {
      weekdaySource = $('#weekday-template').html();
      const weekdayTemplate = Handlebars.compile(weekdaySource);
      const newWeekdayHTML = weekdayTemplate(forecastObject.weekdayForecast[i]);


      $('.week-forecast').append(newWeekdayHTML);
    }

    //this uses a bootstrap column to center the 5-day forecast section
    $('.week-forecast').prepend($('<div class="col-md-1"></div>'));
  }




  //this function will take the array of weather condition objects and and set a new property on it that specifies the day's most common condition and the icon code associated with that condition
  // start with this: [{ {Rain: {count: 2, iconCode: '10d'}, Clouds: {count: 6, iconCode: '02n'}}, ...]
  const getMostCommonConditionPerDay = (weekConditions) => {

    weekConditions.forEach(day => {
      let conditionCount = 0;
      for (let condition in day) {
        if (day[condition].count > conditionCount) {
          conditionCount = day[condition].count;
          day.avgCondition = condition;
          day.avgIcon = day[condition].iconCode;

          //...and end up with this, one object for each day:
          // [ {Rain: {..}, Clouds: {..}, avgCondition: 'Clouds', avgIcon: '10d'}, ...]
        }
      }
    })
  }


  //this will iterate through each day in our forecast info and find the most common condition by using a count object. Recall that each day will have multiple 3hr data sets that we will iterate through, each looks like this: 
  //  [1589760000, 297.16, "Rain", "2020-05-19 00:00:00", "10d"] and we're interested in the 3rd element = condition
  const getDailyConditions = (fiveDayForecastInfo_Array) => {
    const weekConditions = [];
    fiveDayForecastInfo_Array.forEach(day => {
      const countObj = {};
      day.forEach(threeHourDataSet => {
        if (countObj.hasOwnProperty(threeHourDataSet[2])) {
          countObj[threeHourDataSet[2]].count++;
        } else {
          countObj[threeHourDataSet[2]] = {};
          countObj[threeHourDataSet[2]].count = 1;
          countObj[threeHourDataSet[2]].iconCode = threeHourDataSet[4];
        }
      })
      //each day's count object will hold the the counts of each condition and the weather icon associated with that condition, and looks like this:
      // { {Rain: {count: 2, iconCode: '10d'}, Clouds: {count: 6, iconCode: '02n'},...}
      //then we'll store each day's condition count object in an array
      weekConditions.push(countObj);
    })

    //now that we have the counts of all conditions for each day, we want to find the most common one, so that we can set that to be our final 'avg' condition for each day
    getMostCommonConditionPerDay(weekConditions);
    //now we have our array of object that holds the avg Condition and associated icon:
    //[ {Rain: {..}, Clouds: {..}, avgCondition: 'Clouds', avgIcon: '10d'}, ...] and we'll pass it back to the addWeeklyWeatherToForecastObject so we can add the avg Condition and icon to our final array of daily forecast objects
    return weekConditions;
  }

  //this will get the average temperature for each day in the forecast, weekarray will look like this:
  // [
  //   { weekday: 'Sunday', avgTemp: 78 },
  //   { weekday: 'Monday', avgTemp: 79 },
  //   { weekday: 'Tuesday', avgTemp: 77 },
  //   { weekday: 'Wednesday', avgTemp: 75 }
  // ]

  //this will take all the data for the 5day forecast and get an average temperature for each day.
  const getAverageDailyTemperature = (finalArray) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const arrayOfObjectsWithDayAndTemp = [];

    //We previously partitioned all our data from the api into days, each day filled with data for that day. Each day's array holds up to 8 sets of 3hr data (which each look like this [1589760000, 297.16, "Rain", "2020-05-19 00:00:00", "10d"]). So we want to iterate through each day AND iterate through the data each day contains. We're interested in the 2nd element of each 3hr data set, which is the temperature. 
    finalArray.forEach(day => {
      const dailyObject = {};
      let sum = 0;
      day.forEach(threeHourDataSet => {
        sum += threeHourDataSet[1];
      })
      let avgTemp = sum / day.length;

      //while we are iterating through the days, this will grab the timestamp from the day's data and convert it to a string of the day's name (eg, 'Monday')
      const myDate = new Date(day[0][0] * 1000);
      dailyObject.weekday = weekdays[myDate.getDay()];
      dailyObject.avgTemp = Math.round((avgTemp - 273.15) * 9 / 5 + 32);
      //eg dailyObject = {weekday: 'Monday', avgTemp: 60}

      //now we'll push the daily object into an array of object for storage, and start iterating over the next day
      arrayOfObjectsWithDayAndTemp.push(dailyObject);
    })

    //now we have an array filled with daily objects:
    // [ {weekday: 'Monday', avgTemp: 60}, {weekday: 'Tuesday', avgTemp: 60}...]
    return arrayOfObjectsWithDayAndTemp;

  }

  //this function will take just the info we need from the api's data and create nested arrays of data for each day of the forecast. Reformatting the data will be crucial because we'll want to find averages of temperature and weather conditions per day.
  const extractRevelantInfoFromData = data => {

    //this takes only the forecast data starting tomorrow (as the api returns current day info in their data as well)
    const slicedArray = data.list.slice(data.list.findIndex((el) => {
      return el.dt_txt.includes(('00:00:00'));
    }))


    const dataArray = [];
    //the api gives data for every 3hrs in a day, so we'll save each 3hr dataset in a tempArray, to then push into the dataArray that will hold ALL the 3hr blocks
    for (let i = 0; i < slicedArray.length; i++) {
      const tempArray = []
      tempArray.push(slicedArray[i].dt);
      tempArray.push(slicedArray[i].main.temp);
      tempArray.push(slicedArray[i].weather[0].main);
      tempArray.push(slicedArray[i].dt_txt);
      tempArray.push(slicedArray[i].weather[0].icon);
      dataArray.push(tempArray);
    }

    //now we have a dataArray filled with 5 days worth of data, for every 3hrs. In order to find daily averages for temps and conditions, we should first partition the dataArray into individual days
    const finalArray = [];
    let dayArray = [];
    for (let i = 0; i < dataArray.length; i++) {
      dayArray.push(dataArray[i]);

      //'21:00:00 is our marker for the end of the day, each time we reach this value we'll put the day's data into a dayArray and then push the dayArray into our final array
      if (dataArray[i][3].includes('21:00:00')) {
        const clonedArray = dayArray.slice();
        finalArray.push(clonedArray);
        dayArray.length = 0;
      }

      //this logic is needed because the last day in the forecast will have a variable number of data sets and won't necessarily include our 21:00:00 marker referred to below, so this grab the data for the last day and pushes into the final array
      if (finalArray.length === 4 && i === dataArray.length - 1) {
        const clonedArray = dayArray.slice();
        finalArray.push(clonedArray);
      }

    }

    return finalArray;
  }


  //this will take the weekly forecast from the weather api, convert temp/timestap units and add to Forecast object
  const addWeeklyWeatherToForecastObject = data => {

    const fiveDayForecastInfo_Array = extractRevelantInfoFromData(data);
    /* fiveDayForecastInfo will look like this... (timestamp, temp, condition, date, weather-icon-code)
  [    
    [ [1589760000, 297.16, "Rain", "2020-05-19 00:00:00", "10d"],
      [1589770800, 294.2, "Clouds", "2020-05-19 03:00:00", "02n"],
      [1589781600, 293.26, "Clouds", "2020-05-19 06:00:00", "03n"],
      [1589878800, 292.61, "Rain", "2020-05-19 09:00:00", "10n"],
      [1589889600, 292.53, "Rain", "2020-05-19 12:00:00", "10d"],
      [1589900400, 293.48, "Rain", "2020-05-19 15:00:00", "10d"],
      [1589911200, 292.43, "Rain", "2020-05-19 18:00:00", "10d"],
      [1589922000, 292.44, "Rain", "2020-05-19 21:00:00", "10d"],
    ], 
    plus four more arrays for each of the following days..
  ]
    */

    //now we have all our data partitioned into days (see above). This function will take this data set and return an array that simply lists the day and its average temp in an object. (We'll add more info to each object in the next steps)
    const arrayOfDayObjects = getAverageDailyTemperature(fiveDayForecastInfo_Array);

    /* now we have an arrayOfDayObjects looks like this...
  
    [ {weekday: "Monday", avgTemp: 70},
      {weekday: "Tuesday", avgTemp: 66},
      {weekday: "Wednesday", avgTemp: 60},
      {weekday: "Thursday", avgTemp: 58},
      {weekday: "Friday", avgTemp: 58},
    ] 
  */

    //now we want to add weather conditions and weather icons to the array of day objects above, so here we'll take the fiveDayForecast info and find out what the most common weather condition is for each day. 
    const arrayOfDailyConditions = getDailyConditions(fiveDayForecastInfo_Array);
    /* arrayOfDailyConditions now looks like this (eg)..
    [ {Rain: {..}, Clouds: {..}, avgCondition: 'Clouds', avgIcon: '02d'},
      {Clear: {..}, Clouds: {..}, avgCondition: 'Clear', avgIcon: '01d'},
      {Rain: {..}, Clear: {..}, avgCondition: 'Clouds', avgIcon: '10d'},...
    ]
   */

    //now that we have our avg condition per day and the associated weather icon, we can add this info to the arrayofDayObjects that is already holding our day name and average temp
    arrayOfDayObjects.forEach((day, index) => {
      day.condition = arrayOfDailyConditions[index].avgCondition;
      const iconCode = arrayOfDailyConditions[index].avgIcon;
      day.weatherIconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    })

    // now we have our full array of day objects, each day object will contain the day, avgTemp, avgCondition and weather icon. We'll put this on the forecast object so when renderWeather() is called, the forecastObject is updated. If the forecastObject was holding a previous city's data, that data would be replaced here.
    forecastObject.weekdayForecast = arrayOfDayObjects;

  }

  //this will take the data from the weather api, convert temp from Kelvin to Farhenheit, and add it to our Forecast object (as forecastObject.currentWeather). Use the url in the first .ajax call to see the data we are grabbing, if necessary
  const addCurrentWeatherToForecastObject = data => {
    const tempInFarhenheit = Math.round((data.main.temp - 273.15) * 9 / 5 + 32);

    forecastObject.currentWeather = {
      temperature: tempInFarhenheit,
      city: data.name,
      condition: data.weather[0].main,
      weatherIconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    }

  }

  //this will use jquery to perform an http/ajax request to get the weather data for the input city 
  const fetch = cityName => {

    //this request will get the weather stats for the current day
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
      dataType: "json",
      // beforeSend: function () {
      //   //$('#loader').show();
      // },
      success: function (data) {
        addCurrentWeatherToForecastObject(data);
        renderWeather();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        alert('Please enter a valid city name');
      },
      // complete: function () {
      //   $('#loader').hide()
      // }
    });

    //this request will get the weather data for the next 5 days
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
      dataType: "json",
      // beforeSend: function() {
      //   $('#loader').show();
      // },
      success: function (data) {
        addWeeklyWeatherToForecastObject(data);
        renderWeather();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
      // complete: function() {
      //   $('#loader').hide()
      // }
    });
  }


  return {
    fetch
  }

}

myWeatherApp = WeatherModule()

//create a click event that grabs the city name from the html form input and calls the fetch function
$('.submit').on('click', function (event) {
  const cityName = $('#city-id').val();
  if (cityName) {
    myWeatherApp.fetch(cityName);
  }
  event.preventDefault();

  $('#city-id').val('');

})