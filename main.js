let weatherData = [];
let weekData = {};

const DateTime = luxon.DateTime;

const addData = (data) => {
  weatherData = [];
  let weatherFetched = {
    weather: Math.floor(data.main.temp),
    city: data.name,
    condition: data.weather[0].description,
    icon: 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
  }
  weatherData.push(weatherFetched);
  renderWeather(weatherData);
};

let forecastData = [];
const addForecast = (data) => {
  forecastData = [];
  let forecastDays = [];
  for (let i = 0; i < data.list.length; i++) {
    let day = data.list[i];
    // Add the forecast days available
    let singleDay = parseDay(day.dt);
    if (!forecastDays.includes(singleDay)) {
      // push only days that are not in the forecastDays array
      forecastDays.push(singleDay);
    }
    forecastData.push(getWeather(day))
  } // End of for loop

  // console.log('Starting to build days array...');
  // console.log(forecastDays, 'Days');
  // Get the information by targeting a day array
  // and get the index of the time I need.
  let singleDayData = getDaysArray(forecastData, forecastDays);
  weekData = singleDayData;
  renderWeekWeather();
};

// Use DateTime to convert OpenWeather dt to milliseconds to get time
const convertTime = (rawDate) => DateTime.fromMillis(rawDate * 1000);

const parseDay = (rawDate) => {
  let currentDate = convertTime(rawDate);
  // Get a string day of the week of the next five days
  let currentDay = currentDate.toFormat('DDDD').split(',', 1).toString()
  // console.log(currentDay);
  return currentDay;
}

// TODO: change name of func to getWeatherInfo ??                                                                     
const getWeather = (currentDay) => {
  let dayForecasted = convertTime(currentDay.dt).toFormat('DDDD').split(',', 1).toString()
  let weather = Math.floor(currentDay.main.temp);
  let condition = currentDay.weather[0].main;
  let iconString = currentDay.weather[0].icon;
  let currentTimeData = convertTime(currentDay.dt).toObject();
  return {
    day: dayForecasted,
    weather: weather,
    condition: condition,
    icon: 'http://openweathermap.org/img/w/' + iconString + '.png',
    timeData: currentTimeData
  }

}

const getDaysArray = (data, days) => {
  // TODO: chnage name
  let daysObj = {
    // Do not return a 6th day
    // In some cases we get a 6th array
  }
  let start = 0;
  let eachDayArray = []
  for (let index = 0; index < data.length; index++) {
    let currentDay = days[start];
    const forecastObj = data[index];
    if (_.contains(forecastObj, currentDay)) {
      // console.log('Add to array');
      eachDayArray.push(forecastObj)
    } else {
      // add eachDayArray to the daysObj to keep track of forecast days
      daysObj[`day${start}`] = eachDayArray;
      // empty array for the next day's data
      eachDayArray = [];
      // add object containing second day to array 
      start += 1; // add one to start to keep track of days
      eachDayArray.push(forecastObj)
    }
  }
  // add last array to our daysObj 
  daysObj[`day${start}`] = eachDayArray;
  // Get daysObj to only get five days 
  var size = Object.keys(daysObj).length;
  // delete if in the request we get 6 days 
  if (size >= 6) {
    delete daysObj.day5;
  }
  // console.log(daysObj);
  return daysObj

}



const renderWeather = () => {
  $('.data').empty();
  // create HTML and append to .data
  let source = $("#weather-template").html();
  let template = Handlebars.compile(source);
  let newHTML = template(weatherData[0]);

  $('.data').append(newHTML);
};

// console.log(weekData);
const renderWeekWeather = () => {
  $('.forecast').empty();
  for (const key in weekData) {
    if (weekData.hasOwnProperty(key)) {
      const element = weekData[key];
      let middle = Math.floor(element.length / 2);

      // create HTML and append to .data
      let source = $("#forecast-template").html();
      let template = Handlebars.compile(source);
      let newHTML = template(element[middle]);

      $('.forecast').append(newHTML);
    }
  }
};
// Borrowed this method to get a query.
// stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript
const insertParam2 = (key, value) => {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  let s = document.location.search;
  let kvp = key + "=" + value;

  let r = new RegExp("(&|\\?)" + key + "=[^\&]*");

  s = s.replace(r, "$1" + kvp);

  if (!RegExp.$1) {
    s += (s.length > 0 ? '&' : '?') + kvp;
  };

  // document.location.search = s;

  return s
}

let stateQuery = null;

$('.search').on('click', () => {
  // reset the data array;
  weatherData = [];
  let search = $('#search-query').val();
  search = insertParam2('q', search);
  // console.log(search);
  stateQuery = search;

  let startIndex = 0;
  $('.weather-card').show();
  fetch(search);
  fetchFiveDay(search);
  $('#search-query').val('');

});

// TODO:
let paginateNext = (startIndex) => startIndex + 10;

const fetch = (query) => {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather${query}&units=imperial&appid=b9e1fb39ae5a3a38580d8f3045f29d18`,
    dataType: "json",
    success: (data) => {
      // console.log(data);
      addData(data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(textStatus);
    }
  });
};
const fetchFiveDay = (query) => {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast${query}&units=imperial&appid=b9e1fb39ae5a3a38580d8f3045f29d18`,
    dataType: "json",
    success: (data) => {
      // console.log(data);
      addForecast(data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(textStatus);
    }
  });
};


$('.pagination').hide();
$('.weather-card').hide();