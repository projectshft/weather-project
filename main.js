let apiKey = "504b76049c23a98f2e402766465dad0d"

function renderCurrentWeather(data) {
  $('.current').empty();

  let source = $('#current-template').html();
  let template = Handlebars.compile(source);
  let html = template (data);

  $('.current').append(html);
}


function render5DayWeather (data) {
  $('.5-day').empty();

  let source = $('#5-day-template').html();
  let template = Handlebars.compile(source);

  data.forEach(day => {
    let html = template (day);

    $('.5-day').append(html);
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
      data.weather[0].icon = '04d'
    }
  }
  return weatherData;
}


function fetchCurrent (lat, lon) {
  $.get("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + 
        "&lon=" + lon + 
        "&APPID=" + 
        apiKey + 
        "&units=imperial", 
        function(data) {
          data = changeIcon(data);
          let compressedData = {condition: data.weather[0].main, temp: data.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png', day: "Today"}

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
          let day1 = data.list[0]
          let day2 = data.list[8];
          let day3 = data.list[16];
          let day4 = data.list[24];
          let day5 = data.list[32];

          let compressedData = [
            {condition: day1.weather[0].main, temp: day1.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + day1.weather[0].icon + '@2x.png', day: "Today"},
            {condition: day2.weather[0].main, temp: day2.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + day2.weather[0].icon + '@2x.png', day: "Today"},
            {condition: day3.weather[0].main, temp: day3.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + day3.weather[0].icon + '@2x.png', day: "Today"},
            {condition: day4.weather[0].main, temp: day4.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + day4.weather[0].icon + '@2x.png', day: "Today"},
            {condition: day5.weather[0].main, temp: day5.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + day5.weather[0].icon + '@2x.png', day: "Today"}
          ]
          console.log(compressedData)

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

  // fetchCurrent(query);
  // fetch5Day(query);
  fetchCoordinates(query);
})


$('button.current-location').click(function () {
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













renderCurrentWeather({condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"})
render5DayWeather([{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"}])