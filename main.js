let cityCurrentWeather = [];
let cityFiveDayWeather = [];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const findToday = (aUnixStamp, fiveDayData) => {
  console.log('finding today!');
  // console.log(fiveDayData); //along for the ride

  //Convert the UNIX stamp that was generated on button click to
  //day of the week and (in loop in addFiveDayWeatherDataToArray function)
  // add to each five day weather object.
  const aDateAndTimeStamp = new Date(aUnixStamp);
  // const today = days[aDateAndTimeStamp.getDay()];
  const todayNumber = aDateAndTimeStamp.getDay();
  addFiveDayWeatherDataToArray(fiveDayData, todayNumber);
};

const addCurrentWeatherDataToArray = (currentData) => {
  //Convert temp returned in Kelvin to F
  const fahrenheitFromKelvin = Math.floor(currentData.main.temp / 3.493);
  //Create current weather object
  const newCityAndWeatherCurrentData = {
    city: currentData.name,
    temp: fahrenheitFromKelvin,
    description: currentData.weather[0].description,
  };
  //Push to array
  cityCurrentWeather.push(newCityAndWeatherCurrentData);
  //send data to a function to be rendered on the page
  renderCurrentWeather(cityCurrentWeather);
};

const renderCurrentWeather = (aCurrentWeatherArrayToRender) => {
  //Clear the existing data on the page
  $('#currentWeatherData').empty();
  //We know our array contains only 1 item for current weather, so no loop is necessary
  let weather = aCurrentWeatherArrayToRender[0];
  //Prepare handlebars template
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);
  const weatherHTML = template(weather);
  //Push data to handlebars template, clear entry form, empty the array.
  $('#currentWeatherData').append(weatherHTML);
  $('#cityName').val('');
  aCurrentWeatherArrayToRender = [];
};

const addFiveDayWeatherDataToArray = (fiveDayData, todayNumber) => {
  console.log('adding five day data to array!');
  // console.log(today);
  for (let i = 0; i < fiveDayData.list.length; i++) {
    //convert the imported date-time stamp to a day of the week
    const dateLongFormatText = new Date(fiveDayData.list[i].dt_txt);
    // const dayOfTheWeek = days[dateLongFormatText.getDay()];
    const dayNumberOfTheWeek = dateLongFormatText.getDay();

    //Convert temp returned in Kelvin to F
    const fahrenheitFromKelvinFiveDay = Math.floor(
      fiveDayData.list[i].main.temp / 3.493
    );

    //add brief weather description
    const briefWeatherDesc = fiveDayData.list[i].weather[0].main;

    const newCityAndWeatherFiveDay = {
      weekdayNumber: dayNumberOfTheWeek,
      temperature: fahrenheitFromKelvinFiveDay,
      briefDescription: briefWeatherDesc,
    };

    // Add the object to the five day weather array
    cityFiveDayWeather.push(newCityAndWeatherFiveDay);
  }
  // console.log('outofloop');
  renderFiveDayWeather(cityFiveDayWeather, todayNumber);
};

const renderFiveDayWeather = (aFiveDayWeatherArray, currentDayNumber) => {
  console.log('rendering five day weather!');
  console.log(aFiveDayWeatherArray);
  console.log(currentDayNumber);
  const dayOne = aFiveDayWeatherArray.find(function () {

  });



};


const fetchData = (cityName, todayUNIXStamp) => {
  console.log('fetching data!');
  // console.log(todayUNIXStamp); //along for the ride

  //Run first ajax GET method for current weather data
  $.ajax({
    method: 'GET',
    url:
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      cityName +
      '&appid=1223294114fb8930caf177ea3451f02c',
    dataType: 'json',
    success: function (currentData) {
      //If successful, send results to a function that will add them
      //to a current weather array
      addCurrentWeatherDataToArray(currentData);
      //If successful, retrieve five day forecast
      $.ajax({
        method: 'GET',
        url:
          'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=1223294114fb8930caf177ea3451f02c',
        dataType: 'json',
        success: function (fiveDayDataReturned) {
          console.log('successfully retrieved five day data!');
          //decode unix stamp for today before processing data
          findToday(todayUNIXStamp, fiveDayDataReturned);
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

$('.search').on('click', function () {
  $('#currentWeatherData').empty();
  console.log('clicked');
  const todayUNIXStamp = Date.now();
  const userInputCity = $('#cityName').val();
  //send both values to fetchData function (todayUNIXstamp is along for the ride)
  fetchData(userInputCity, todayUNIXStamp);
});

// https://api.openweathermap.org/data/2.5/forecast?q=durham&appid=1223294114fb8930caf177ea3451f02c
