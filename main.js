const weatherData = {
  currentData: {},

  forecastData: []
};

const fetchWeather = (city) => {
  //get data for current weather
  let fetchCurrent = $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=e67216f1d8d59d8c6c67f7fbb818fc1b",
    dataType: "json",
    success: (data) => {
      addCurrentWeather(data); //add data to current weather data
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(textStatus);
    }
  })

  //then get data for 5 day forecast
  $.when(fetchCurrent).then($.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=e67216f1d8d59d8c6c67f7fbb818fc1b",
    dataType: "json",
    success: (data) => {
      addWeatherForecast(data); //add data to weather forecast data
      renderWeather(); //render current weather and forecast to page
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(textStatus);
      alert(errorThrown);
      resetData(); //clear data and reset page
    }
  }));
};

//store returned weather results
const addCurrentWeather = (data) => {
  //store current weather in object
  let currentWeather = {
    city: data.name,
    temp: Math.round(data.main.temp), //round temperature
    condition: data.weather[0].description,
    icon: data.weather[0].icon.slice(0, -1) + 'd' //store day version of icons for consistency
  }

  //add current weather object to weatherData
  weatherData.currentData = currentWeather;
};

//add forecast data to weatherData, reducing results to 1 object for each of the 5 days
const addWeatherForecast = (data) => {
  //arrays to store weather forecast data for sorting and filtering
  let allForecastData = [];
  let groupedForecastData = [];
  let dailyData = [];

  //iterate through data results and store each 3 hour prediction with relevant information
  data.list.forEach(forecast => {
    let forecastData = {
      temp: forecast.main.temp,
      condition: forecast.weather[0].description,
      icon: forecast.weather[0].icon, //store weather icon for condition
      day: getWeekDay(forecast.dt_txt) //convert timestamp to day of week (integer)
    }
    allForecastData.push(forecastData);
  });

  //split forecast data into 5 groups of 8, in order by time
  for (let i = 0; i < 5; i++) {
    groupedForecastData.push(allForecastData.splice(0, 8));
  }

  //restructuring each sub-array of weather data into single object with array each for temps, conditions, day, and icons
  groupedForecastData.forEach((group) => {
    dailyData.push(group.reduce((allDay, hour) => {
      allDay.temp.push(hour.temp);
      allDay.condition.push(hour.condition);
      allDay.day.push(hour.day);
      allDay.icon.push(hour.icon);
      return allDay;
    }, {
      temp: [],
      condition: [],
      day: [],
      icon: []
    }));
  });

  //reduce each property's array for each day to one value
  dailyData.forEach(dayWeather => {
    //find starting weekday for each daily array
    dayWeather.day = dayWeather.day[0];

    //find most common weather condition for each daily array
    let weatherConditionWithIcon = dayWeather.condition.reduce((frequencyTracker, hourlyCondition, index) => {
      //add condition property to tracker or increase count
      if (frequencyTracker.hasOwnProperty(hourlyCondition)) {
        frequencyTracker[hourlyCondition] += 1;
      } else {
        frequencyTracker[hourlyCondition] = 1;
      }

      //if current condition is greater than most frequent, replace most frequent with current
      if (frequencyTracker[hourlyCondition] > frequencyTracker.mostFrequent.count) {
        frequencyTracker.mostFrequent.condition = hourlyCondition;
        frequencyTracker.mostFrequent.icon = dayWeather.icon[index]; //get weather icon at same index as condition
        frequencyTracker.mostFrequent.count = frequencyTracker[hourlyCondition];
      }

      return frequencyTracker;

    }, {
      mostFrequent: {
        count: 0
      }
    });

    //assign returned most common condition to current day's object
    dayWeather.condition = weatherConditionWithIcon.mostFrequent.condition;

    //assign icon associated with most common condition to current day's object
    dayWeather.icon = weatherConditionWithIcon.mostFrequent.icon.slice(0, -1) + 'd'; //saving all icons as day version for consistency

    //get daily low temps
    dayWeather.low = Math.round(dayWeather.temp.sort()[0]);

    //get daily high temps
    dayWeather.high = Math.round(dayWeather.temp.reverse()[0]);

    //average the temps in each daily array
    dayWeather.temp = Math.round(dayWeather.temp.reduce((totalTemp, hourlyTemp) => {
      //get sum of all temps
      totalTemp += hourlyTemp;

      return totalTemp;

    }, 0) / dayWeather.temp.length); //divide total by number of temps and round to integer

  });

  //clear forecastData array
  weatherData.forecastData = [];

  //add daily forecasts to forecastData array
  weatherData.forecastData.push(...dailyData)
};

//take stored weather data and display it on the page
const renderWeather = () => {
  //clear html content from page
  $('#current-weather').empty();
  $('#week').empty();

  //get current weather template
  let currentSource = $('#current-template').html();

  //compile template
  let currentTemplate = Handlebars.compile(currentSource);

  //fill template with data
  let currentHtml = currentTemplate(weatherData.currentData);

  //render final html to page
  $('#current-weather').append(currentHtml);

  //render each forecast result to page with template
  weatherData.forecastData.forEach(result => {
    //get forecast weather template
    let forecastSource = $('#forecast-template').html();

    //compile template
    let forecastTemplate = Handlebars.compile(forecastSource);

    //fill template with data
    let forecastHtml = forecastTemplate(result);

    //render final html to page
    $('#week').append(forecastHtml);

    //show hidden elements
    $('#forecast-header').removeClass('hide');
    $('#current-section').removeClass('hide');
  });
};

//add click event to search button to get data and render results
$('#search-button').click(() => {
  //fetch data with value of search input
  fetchWeather($('#search-input').val());

  //clear input field
  $('#search-input').val('');
});

//function to clear data and reset page in case of search errors
const resetData = () => {
  //clear html from page
  $('#week').empty()
  $('#current-weather').empty()

  //re-hide unhidden elements
  $('#forecast-header').addClass('hide');
  $('#current-section').addClass('hide');

  //clear weather data
  weatherData.forecastData = [];
  weatherData.currentData = {};
}

//function to convert date string to weekday to display in forecast
const getWeekDay = (dateString) => {
  //convert date string to date, then get weekday (integer)
  let dayOfWeek = new Date(dateString).getDay();

  //convert weekday integer to weekday string
  switch (dayOfWeek) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}
