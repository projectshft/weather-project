$('button').on('click', function(){
var userInputArr = $('input').val().split(', ');
var city = userInputArr[0];
var state = userInputArr[1];

getCoordinates(city, state);
});

var getCoordinates = function(city, state){
  // debugger;
 
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=7458d8be2ead97f146f0eca0e76fec3b`)
  .then(res => res.json())
  .then((data) => {
    var targetLocation = data.find(obj => obj.state === state||obj.country === state);
    // console.log(targetLocation);
    weatherMan(targetLocation);
    weatherForecast(targetLocation);

  })
};

var weatherMan = function(targetLocation){

  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${targetLocation.lat}&lon=${targetLocation.lon}&units=imperial&appid=7458d8be2ead97f146f0eca0e76fec3b`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    currentDayDataObj = {
    currentTemp : Math.round(data.main.temp),
    city : data.name,
    conditions : data.weather[0].main,
    icon: data.weather[0].icon
    };
    renderWeather(currentDayDataObj);
  });
};
var renderWeather = function(currentDayDataObj){
  $('.today-weather').empty();
  var templateSource = $('#todayWthr-template').html();
  var template= Handlebars.compile(templateSource);
  var newHtml = template(currentDayDataObj);
  $('.today-weather').append(newHtml);
}

var weatherForecast = function(targetLocation){
  $('.five-day-weather').empty();
  fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${targetLocation.lat}&lon=${targetLocation.lon}&units=imperial&appid=7458d8be2ead97f146f0eca0e76fec3b`)
  .then(res => res.json())
  .then(data => {
    for (var i = 4; i < data.list.length; i += 8){

      //convert date to weekday
      var d = new Date(data.list[i].dt_txt);
      var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      var day = weekday[d.getDay()];

      // object to pass into js handlebars func
      fiveDayDataObj = {
        conditionsFcst: data.list[i].weather[0].main,
        tempFcst: Math.round(data.list[i].main.temp),
        iconFcst: data.list[i].weather[0].icon,
        dayFcst: day
      }
      console.log(fiveDayDataObj);
      renderForecast(fiveDayDataObj);
    }
  })
}

var renderForecast = function(fiveDayDataObj){
  
  var templateSource1 = $('#fiveDayWthr-template').html();
  var template1= Handlebars.compile(templateSource1);
  var newHtml1 = template1(fiveDayDataObj);
  $('.five-day-weather').append(newHtml1);
}



      





