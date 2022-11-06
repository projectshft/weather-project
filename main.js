let apiKey = "504b76049c23a98f2e402766465dad0d"

function renderCurrentWeather(data) {
  $('.current').empty();

  let source = $('#current-template').html();
  let template = Handlebars.compile(source);
  let html = template (data);

  $('.current').append(html);
}


function render5DayWeather (data) {
  $('.five-day').empty();

  let source = $('#five-day-template').html();
  let template = Handlebars.compile(source);

  data.forEach(day => {
    let html = template (day);

    $('.five-day').append(html);
  });
}


function changeIcon(weatherData) {//the '03d' and '03n' icons are blank white
  if(weatherData.list) {
    weatherData.list.forEach((data) => {
      if(data.weather[0].icon.includes('03')){
        data.weather[0].icon = '04d'
      }
    })
  } else {
    if(weatherData.weather[0].icon.includes('03')){
      weatherData.weather[0].icon = '04d'
    }
  }
  return weatherData;
}


function getDay (unixTime) {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  let weekDayNum = new Date(unixTime * 1000).getDay();

  let day = days[weekDayNum];

  return day;
}


function fetchCurrent (lat, lon) {
  $.get("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + 
        "&lon=" + lon + 
        "&APPID=" + 
        apiKey + 
        "&units=imperial", 
        function(data) {
          data = changeIcon(data);
          let compressedData = {condition: data.weather[0].main, temp: Math.round(data.main.temp), iconUrl: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png', location: data.name}

          renderCurrentWeather(compressedData);
        })
}

function fetch5Day (lat, lon) {
  $.get("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + 
        "&lon=" + lon + 
        "&APPID=" + 
        apiKey + 
        "&units=imperial",

        function(data) {
          data = changeIcon(data);

          let days = [];
          for(let i = 0; i < data.list.length; i += 8){//should be 5 days as long as 40 items are returned
            days.push(data.list[i])
          }
         
          let compressedData = []
          days.forEach((day) => {
            let dayObj = {condition: day.weather[0].main, 
                          tempMin: Math.round(day.main.temp_min), 
                          tempMax: Math.round(day.main.temp_max), 
                          iconUrl: 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png', 
                          day: getDay(day.dt)
                        }
            compressedData.push(dayObj);
          })

          render5DayWeather(compressedData)
        });
}


function fetchCoordinates(query) {
  $.get("https://api.openweathermap.org/geo/1.0/direct?q=" + 
  query + 
  "&APPID=" + 
  apiKey,
  function(data) {
    let lat = data[0].lat;
    let lon = data[0].lon;

    fetchCurrent(lat, lon);
    fetch5Day(lat, lon)
  })
}


$('#search-button').click(function() {
  
  let query = $('#search-query').val();
  
  if(query) {
    $('.five-day').removeClass('visually-hidden');
    
    fetchCoordinates(query);
  }
  
})


$('button.current-location').click(function () {
  $('.five-day').removeClass('visually-hidden')

  let lon = null;
  let lat = null;

  navigator.geolocation.getCurrentPosition(function(pos) {
    let crds = pos.coords;
    lat = crds.latitude;
    lon = crds.longitude;
    
    fetchCurrent(lat, lon);
    fetch5Day(lat, lon);
  })
})
