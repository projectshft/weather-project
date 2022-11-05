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


function fetchCurrent (query) {
  $.get("https://api.openweathermap.org/data/2.5/weather?q=" + 
        query + 
        "&APPID=" + 
        apiKey + 
        "&units=imperial", 
        function(data) {
          let compressedData = {condition: data.weather[0].main, temp: data.main.temp, iconUrl: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png', day: "Today"}

          renderCurrentWeather(compressedData);
        })
}

function fetch5Day (query) {
  $.get("https://api.openweathermap.org/data/2.5/forecast?q=" + 
        query + 
        "&APPID=" + 
        apiKey + 
        "&units=imperial", 
        function(data) {
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

          console.log(compressedData);

          render5DayWeather(compressedData)
        });
}


$('#search-button').click(function() {
  let query = $('#search-query').val();

  fetchCurrent(query);
  fetch5Day(query);
})
















// renderCurrentWeather({condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"})
// render5DayWeather([{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"},{condition: 'clouds', temp: '58', iconUrl: 'http://openweathermap.org/img/wn/01d@2x.png', day: "Today"}])