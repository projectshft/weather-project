var currentWeatherArray = [];

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=5e5a03c24f89b112d6b16ccfccf14576",
    dataType: "json",
    success: function (data) {
      
      addWeather(data);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      debugger;
      console.log(textStatus);
    }
  });
};


$('.search').on('click', function () {
  var search = $('#search-query').val();
  
  fetch(search);
  fetchFiveDay(search);
  
});

var addWeather = function (data) {
  
  currentWeatherArray = [];
  
  var weather = {
    name: data.name || null,
    currentTemp: Math.floor(kelvinToF(data.main.temp)) + '°' || null,
    main: data.weather[0].main || null,
    icon: 'http://openweathermap.org/img/wn/' + data.weather[0].icon +'@2x.png'|| null
  };  
  currentWeatherArray.push(weather);
    renderCurrentWeather();
    
  };


var renderCurrentWeather = function() {
  $('.current-forecast').empty();

  for (let i = 0; i < currentWeatherArray.length; i++) {
    const weather = currentWeatherArray[i];

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);
   

    $('.current-forecast').append(newHTML);

    
  }
};


renderCurrentWeather();


function kelvinToF (number) {
  return (number - 273.15) * 9/5 + 32;
};


function convertDate (date) {

  var dateToDay = new Date(date);
  var dayToNumber = dateToDay.getDay();

  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var day = (daysOfTheWeek[dayToNumber]);
  return day;
}


var fiveDayWeather = [
  {
    mainWeather: null,
    day: null,
    temp: null,
    icon: null
  },
  {
    mainWeather: null,
    day: null,
    temp: null,
    icon: null
  },
  {
    mainWeather: null,
    day: null,
    temp: null,
    icon: null
  },
  {
    mainWeather: null,
    day: null,
    temp: null,
    icon: null
  },
  {
    mainWeather: null,
    day: null,
    temp: null,
    icon: null
  }
];


var addFiveDayWeather = {

  day1Average: function(data) {
    var day1Sum = 0;
    var day1Average = 0;
      for (let i = 0; i <= 7; i++) {
      day1Sum = data.list[i].main.temp + day1Sum;
      };
    day1Average = Math.floor(kelvinToF(day1Sum / 8));
    fiveDayWeather[0].temp = (day1Average + '°');
    
    fiveDayWeather[0].mainWeather = (data.list[7].weather[0].main);
    fiveDayWeather[0].icon = 'http://openweathermap.org/img/wn/' + data.list[7].weather[0].icon +'@2x.png';
    fiveDayWeather[0].day = convertDate(data.list[7].dt_txt);
  },

  day2Average: function(data) {
    var day2Sum = 0;
    var day2Average = 0;
      for (let i = 8; i <= 15; i++) {
      day2Sum = data.list[i].main.temp + day2Sum;
      };
    day2Average = Math.floor(kelvinToF(day2Sum / 8));
    fiveDayWeather[1].temp = (day2Average  + '°');

    fiveDayWeather[1].mainWeather = (data.list[15].weather[0].main);
    fiveDayWeather[1].icon = 'http://openweathermap.org/img/wn/' + data.list[15].weather[0].icon +'@2x.png';

    fiveDayWeather[1].day = convertDate(data.list[15].dt_txt);
  },

  day3Average: function(data) {
    var day3Sum = 0;
    var day3Average = 0;
      for (let i = 16; i <= 23; i++) {
      day3Sum = data.list[i].main.temp + day3Sum;
      };
    day3Average = Math.floor(kelvinToF(day3Sum / 8));
    fiveDayWeather[2].temp = (day3Average  + '°');

    fiveDayWeather[2].mainWeather = (data.list[23].weather[0].main);
    fiveDayWeather[2].icon = 'http://openweathermap.org/img/wn/' + data.list[23].weather[0].icon +'@2x.png';

    fiveDayWeather[2].day = convertDate(data.list[23].dt_txt);

  },

  day4Average: function(data) {
    var day4Sum = 0;
    day4Average = 0;
    for (let i = 24; i <= 31; i++) {
      day4Sum = data.list[i].main.temp + day4Sum;
    };
    day4Average = Math.floor(kelvinToF(day4Sum / 8));
    fiveDayWeather[3].temp = (day4Average  + '°');

    fiveDayWeather[3].mainWeather = (data.list[31].weather[0].main);
    fiveDayWeather[3].icon = 'http://openweathermap.org/img/wn/' + data.list[31].weather[0].icon +'@2x.png';

    fiveDayWeather[3].day = convertDate(data.list[31].dt_txt);
  },

  day5Average: function(data) {
    var day5Sum = 0;
    var day5Average = 0;
    for (let i = 32; i <= 39; i++) {
      day5Sum = data.list[i].main.temp + day5Sum;
    };
    day5Average = Math.floor(kelvinToF(day5Sum / 8));
    fiveDayWeather[4].temp = (day5Average + '°');

    fiveDayWeather[4].mainWeather = (data.list[39].weather[0].main);
    fiveDayWeather[4].icon = 'http://openweathermap.org/img/wn/' + data.list[39].weather[0].icon +'@2x.png';

    fiveDayWeather[4].day = convertDate(data.list[39].dt_txt);
    console.log(fiveDayWeather);
  },
};


var renderFiveDayWeather = function() {
  $('.five-day-forecast').empty();
  
    for (let i = 0; i < fiveDayWeather.length; i++) {
      var source = $('#five-day-weather-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(fiveDayWeather[i]);
      $('.five-day-forecast').append(newHTML);
    }
};


  var fetchFiveDay = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=5e5a03c24f89b112d6b16ccfccf14576",
      dataType: "json",
      success: function (data) {
        
        addFiveDayWeather.day1Average(data);
        addFiveDayWeather.day2Average(data);
        addFiveDayWeather.day3Average(data);
        addFiveDayWeather.day4Average(data);
        addFiveDayWeather.day5Average(data);    
        renderFiveDayWeather();    

      },
      error: function (jqXHR, textStatus, errorThrown) {
        debugger;
        console.log(textStatus);
      }
    });
  };

 