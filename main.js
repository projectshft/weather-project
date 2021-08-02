var currentWeatherData  = [];
var fiveDayForecastData = [];

var fetchWeatherData = function(city) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=83b3a3ff4100ab8f87dc416f724b6120`,
    dataType: "json",
    success: function(data) {
      addCurrentWeatherData(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert(errorThrown);
    }
  });
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=83b3a3ff4100ab8f87dc416f724b6120`,
    dataType: "json",
    success: function(data) {
      addFiveDayForecastData(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addCurrentWeatherData = function(data) {
  currentWeatherData  = [];
  
  var city = data.name;
  var temp = Math.round(data.main.temp) + "\u00B0";
  var descrip = data.weather[0].main;
  var iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
  var pushObj = {
    temp: temp || null,
    city: city || null,
    descrip: descrip || null,
    iconUrl: iconUrl || null
  };

  currentWeatherData.push(pushObj);
};

var addFiveDayForecastData = function(data) {
  fiveDayForecastData = [];
  var sumTemp1 = 0;
  var sumTemp2 = 0;
  var sumTemp3 = 0;
  var sumTemp4 = 0;
  var sumTemp5 = 0;

  for (var i = 0; i < data.list.length; i++) {
    if (i < 8) {
      sumTemp1 += data.list[i].main.temp; 
    };
    if (i > 7 && i < 16) {
      sumTemp2 += data.list[i].main.temp; 
    };
    if (i > 15 && i < 24) {
      sumTemp3 += data.list[i].main.temp; 
    };
    if (i > 23 && i < 32) {
      sumTemp4 += data.list[i].main.temp; 
    };
    if (i > 31) {
      sumTemp5 += data.list[i].main.temp; 
    };
  };

  var obj1 = {
    descrip: data.list[7].weather[0].main || null,
    avgTemp: Math.round(sumTemp1 / 8) + "\u00B0" || null,
    iconUrl: `http://openweathermap.org/img/wn/${data.list[7].weather[0].icon}@2x.png` || null,
    dayOfWeek: moment().add(1,'days').format('dddd') || null
  };
  var obj2 = {
    descrip: data.list[15].weather[0].main || null,
    avgTemp: Math.round(sumTemp2 / 8) + "\u00B0" || null,
    iconUrl: `http://openweathermap.org/img/wn/${data.list[15].weather[0].icon}@2x.png` || null,
    dayOfWeek: moment().add(2,'days').format('dddd') || null
  };
  var obj3 = {
    descrip: data.list[23].weather[0].main || null,
    avgTemp: Math.round(sumTemp3 / 8) + "\u00B0" || null,
    iconUrl: `http://openweathermap.org/img/wn/${data.list[23].weather[0].icon}@2x.png` || null,
    dayOfWeek: moment().add(3,'days').format('dddd') || null
  };
  var obj4 = {
    descrip: data.list[31].weather[0].main || null,
    avgTemp: Math.round(sumTemp4 / 8) + "\u00B0" || null,
    iconUrl: `http://openweathermap.org/img/wn/${data.list[31].weather[0].icon}@2x.png` || null,
    dayOfWeek: moment().add(4,'days').format('dddd') || null
  };
  var obj5 = {
    descrip: data.list[39].weather[0].main || null,
    avgTemp: Math.round(sumTemp5 / 8) + "\u00B0" || null,
    iconUrl: `http://openweathermap.org/img/wn/${data.list[39].weather[0].icon}@2x.png` || null,
    dayOfWeek: moment().add(5,'days').format('dddd') || null
  };

  fiveDayForecastData.push(obj1, obj2, obj3, obj4, obj5);

  renderWeatherData();
};

var renderWeatherData = function() {
  $('.current-render').empty();
  $('.five-day-render').empty();

  var source = $('#current-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeatherData[0]);
  $('.current-render').append(newHTML);
  
  for (let i = 0; i < fiveDayForecastData.length; i++) {
    var source5 = $('#five-day-template').html();
    var template5 = Handlebars.compile(source5);
    var newHTML5 = template5(fiveDayForecastData[i]);
    $('.five-day-render').append(newHTML5);
  };
};

$('button').on('click', function() {  
  var cityInput = $('input').val();

  if (cityInput == "") {
    return alert("Please enter a city name.");
  }

  $('input').val('');
  fetchWeatherData(cityInput);
});
