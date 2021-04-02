// current Day and forecast arrays
const currDay = [];
const forecast = [];

// l5-l14 adds the current day data to currDay array
const addDay = function (data) {
  // l8-l13 pushes to the curDay array after getting the data argument
  currDay.push({
    temp: Math.floor(data.main.temp),
    city: data.name,
    status: data.weather[0].main,
    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  });
};

// l17-l45 adds the forecast data to forecast array
const addForecast = function (data) {
  // l19-l21 filters each day at the 1200 marker
  const sortedForecast = data.list.filter(
    (elem) => elem.dt_txt.charAt(12) == 2
  );

  // l24-l44 loops through the sorted forecast
  for (const i of sortedForecast) {
    // l26-l36 converts the date to day of the week using index notation
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dateOfI = new Date(i.dt_txt);
    const dayOfWeek = days[dateOfI.getDay()];
    // l38-l43 pushes the data to forecast array
    forecast.push({
      fStatus: i.weather[0].main,
      fTemp: Math.floor(i.main.temp),
      fIconUrl: `https://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png`,
      fDate: dayOfWeek,
    });
  }
};

// l48-l67 renders the data to the page
const renderData = function () {
  // l49-l51 emptyies the html container elements
  $('.current-day').empty();
  $('.forecast-row').empty();

  // l54-l59  loops through the current day array and appends it
  for (let i = 0; i < currDay.length; i++) {
    const source = $('#current-day-template').html();
    const template = Handlebars.compile(source);
    const currentDay = template(currDay[i]);
    $('.current-day').append(currentDay);
  }
  // l61-l67 loops through the forecast array and appends it
  for (let i = 0; i < forecast.length; i++) {
    const source = $('#forecast-template').html();
    const template = Handlebars.compile(source);
    const currentForecast = template(forecast[i]);
    $('.forecast-row').append(currentForecast);
  }
};

// l70-l146 does the api calls and invokes the previouse functions
const fetchData = function () {
  // l71-l106 is the button that searches for the city name
  $('.city-search').on('click', function (e) {
    // l73-l77 empties the array's, prevents page refresh, gets the city input
    currDay.splice(0, currDay.length);
    forecast.splice(0, forecast.length);
    e.preventDefault();
    const query = $('.city-input').val();

    // l79-l92 calls for the current day, invokes addDay() & renderData()
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=fd83bef0eb12c19f364bcd16ae1d8216`,

      dataType: 'json',
      success(data) {
        addDay(data);
        renderData();
      },
      error(jqXHR, text, errorThrown) {
        console.log(text);
      },
    });
    // l94-l106 calls for the forecast, invokes addForecast() & renderData()
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=fd83bef0eb12c19f364bcd16ae1d8216`,

      dataType: 'json',
      success(data) {
        addForecast(data);
        renderData();
      },
      error(jqXHR, text, errorThrown) {
        console.log(text);
      },
    });
  });

  // l109-l145 is the button that searches for the zipcode
  $('.zip-search').on('click', function (e) {
    currDay.splice(0, currDay.length);
    forecast.splice(0, forecast.length);
    e.preventDefault();
    const query = $('.zip-input').val();

    // l116-l29 calls for the current day invokes addDay() & renderData()
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?zip=${query}&units=imperial&appid=fd83bef0eb12c19f364bcd16ae1d8216`,

      dataType: 'json',
      success(data) {
        addDay(data);
        renderData();
      },
      error(jqXHR, text, errorThrown) {
        console.log(text);
      },
    });

    // l131-l44 calls for the forecast, invokes addForecast() & renderData()
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/forecast?zip=${query}&units=imperial&appid=fd83bef0eb12c19f364bcd16ae1d8216`,

      dataType: 'json',
      success(data) {
        addForecast(data);
        renderData();
      },
      error(jqXHR, text, errorThrown) {
        console.log(text);
      },
    });
  });
};

// invokes fetchData function
fetchData();
