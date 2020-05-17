//create an object that will hold the data from the weather api for the current day and weekly forecast
const forecastObject = {

  //weekdayForecast: []
  //[
  //   {
  //     condition: "rainy",
  //     avgTemp: 70,
  //     weekday: "wednesday",
  //     weatherIconURL: "cloud_PNG27.png"
  //   },
  //   {
  //     condition: "sunny",
  //     avgTemp: 70,
  //     weekday: "tuesday",
  //     weatherIconURL: "cloud_PNG27.png"
  //   },
  //   {
  //     condition: "sleet",
  //     avgTemp: 30,
  //     weekday: "wednesday",
  //     weatherIconURL: "cloud_PNG27.png"
  //   }
  // ]
}

//create a function that will use handlebars to take the infomation in the forecastObject and append it to the page
const renderWeather = () => {
  $('.current-weather').empty();
  $('.week-forecast').empty();

  currentSource = $('#current-day-template').html();
  const currentTemplate = Handlebars.compile(currentSource);
  const newCurrentHTML = currentTemplate(forecastObject.currentForecast);
  $('.current-weather').append(newCurrentHTML);

  //the weekdayForecast will be an array of daily forecasts, so we must loop through that create template/append new html for each day
  for (let i = 0; i < forecastObject.weekdayForecast.length; i++) {
    weekdaySource = $('#weekday-template').html();
    const weekdayTemplate = Handlebars.compile(weekdaySource);
    const newWeekdayHTML = weekdayTemplate(forecastObject.weekdayForecast[i]);
    // if (i === 0) {
    //   newWeekdayHTML.setAttribute('class', 'day col-md-2 offset-md-1');
    // }
    $('.week-forecast').append(newWeekdayHTML);
  }

  $('.week-forecast').prepend($('<div class="col-md-1"></div>'));
}

//this will take the data from the weather api, convert temp from Kelvin to Farhenheit, and add it to our Forecast object
const addCurrentWeatherToForecastObject = data => {
  const tempInFarhenheit = Math.round((data.main.temp - 273.15) * 9 / 5 + 32);

  forecastObject.currentForecast = {
    temperature: tempInFarhenheit,
    city: data.name,
    condition: data.weather[0].main,
    weatherIconURL: "cloud_PNG27.png"
  }

}


//this will find the most common condition per day 
const getMostCommonConditionPerDay = (weekConditions) => {

  weekConditions.forEach(day => {
    let conditionCount = 0;
    for (let condition in day) {
      if (day[condition] > conditionCount) {
        conditionCount = day[condition];
        day.avgCondition = condition;
      }
    }
  })
}


//this will count the conditions for each time block in each day
const getDailyConditions = (finalArray) => {
  const weekConditions = [];
  finalArray.forEach(day => {
    const countObj = {};
    day.forEach(timeBlock => {
      if (countObj.hasOwnProperty(timeBlock[2])) {
        countObj[timeBlock[2]]++
      } else {
        countObj[timeBlock[2]] = 1;
      }
    })
    weekConditions.push(countObj);
  })

  getMostCommonConditionPerDay(weekConditions);
  return weekConditions;
}

//this will get the average temperature for each day in the forecast, weekarray will look like this:
// [
//   { weekday: 'Sunday', avgTemp: 78 },
//   { weekday: 'Monday', avgTemp: 79 },
//   { weekday: 'Tuesday', avgTemp: 77 },
//   { weekday: 'Wednesday', avgTemp: 75 }
// ]
const getAverageDailyTemperature = (finalArray) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekArray = [];

  finalArray.forEach(day => {
    const dailyObject = {};
    let sum = 0;
    day.forEach(timeBlock => {
      sum += timeBlock[1];
    })
    let avgTemp = sum / day.length;
    const myDate = new Date(day[0][0] * 1000);
    dailyObject.weekday = weekdays[myDate.getDay()];
    dailyObject.avgTemp = Math.round((avgTemp - 273.15) * 9 / 5 + 32);
    weekArray.push(dailyObject);
  })
  return weekArray;

}


//this function will accept the data from the api and return the weekly data as an array of days, each day array will hold 3hr blocks of data (timestamp, temp, condition, date)
// [
//   [
//     [ 1589673600, 298.52, 'Clouds', '2020-05-17 00:00:00' ],
//     [ 1589684400, 295.45, 'Clouds', '2020-05-17 03:00:00' ],
//     [ 1589695200, 294.22, 'Clouds', '2020-05-17 06:00:00' ],
//     [ 1589706000, 293.65, 'Clouds', '2020-05-17 09:00:00' ],
//     [ 1589716800, 295.05, 'Clouds', '2020-05-17 12:00:00' ],
//     [ 1589727600, 301.26, 'Clouds', '2020-05-17 15:00:00' ],
//     [ 1589738400, 305.87, 'Clouds', '2020-05-17 18:00:00' ],
//     [ 1589749200, 307, 'Clouds', '2020-05-17 21:00:00' ]
//   ],
const extractRevelantInfoFromData = data => {
  //first remove the data in the list for the current day
  const slicedArray = data.list.slice(data.list.findIndex((el) => {
    return el.dt_txt.includes(('00:00:00'));
  }))


  const dataArray = [];
  for (let i = 0; i < slicedArray.length; i++) {
    const tempArray = []
    tempArray.push(slicedArray[i].dt);
    tempArray.push(slicedArray[i].main.temp);
    tempArray.push(slicedArray[i].weather[0].main);
    tempArray.push(slicedArray[i].dt_txt);
    dataArray.push(tempArray);
  }


  const finalArray = [];
  let dayArray = [];
  for (let i = 0; i < dataArray.length; i++) {
    dayArray.push(dataArray[i]);

    if (finalArray.length === 4 && i === dataArray.length - 1) {
      const clonedArray = dayArray.slice();
      finalArray.push(clonedArray);
    }

    if (dataArray[i][3].includes('21:00:00')) {
      const clonedArray = dayArray.slice();
      finalArray.push(clonedArray);
      dayArray.length = 0;
    }
  }

  return finalArray;
}


//this will take the weekly forecast from the weather api, convert temp/timestap units and add to Forecast object
const addWeeklyWeatherToForecastObject = data => {
  const dataForDaysOfTheWeekArray = extractRevelantInfoFromData(data);
  const arrayOfDayObjectsWithAvgTemp = getAverageDailyTemperature(dataForDaysOfTheWeekArray);
  /* arrayOfDayObjectsWithAvgTemp looks like this...

  [ {weekday: "Monday", avgTemp: 70}
    {weekday: "Tuesday", avgTemp: 66}
    {weekday: "Wednesday", avgTemp: 60}
    {weekday: "Thursday", avgTemp: 58}
  ] 
*/


  const arrayOfDailyConditions = getDailyConditions(dataForDaysOfTheWeekArray);
  /*arrayOfDailyConditions looks like this..

  [ {Rain: 6, Clouds: 2, avgCondition: "Rain"}
    {Rain: 7, Clouds: 1, avgCondition: "Rain"}
    {Rain: 8, avgCondition: "Rain"}
    {Rain: 8, avgCondition: "Rain"} 
  ]
 */

  //now add the average condition to the arrayOfDayObjects
  arrayOfDayObjectsWithAvgTemp.forEach((day, index) => {
    day.condition = arrayOfDailyConditions[index].avgCondition;
    day.weatherIconURL = "cloud_PNG27.png";
  })


  forecastObject.weekdayForecast = arrayOfDayObjectsWithAvgTemp;
  //forecastObject.weekdayForecast.push()
  // {
  //   condition: "sleet",
  //   avgTemp: 30,
  //   weekday: "Wednesday",
  //   weatherIconURL: "cloud_PNG27.png"
  // }
}

//this will use jquery to perform an http/ajax request to get the weather data (first current data, then weekly data)
const fetch = cityName => {

  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
    dataType: "json",
    // beforeSend: function () {
    //   //$('#loader').show();
    // },
    success: function (data) {
      addCurrentWeatherToForecastObject(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
    // complete: function () {
    //   $('#loader').hide()
    // }
  });

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

//create a click event that grabs the city name from the html form input and calls the fetch function
$('.submit').on('click', function () {
  const cityName = $('#city-id').val();
  fetch(cityName);
})


