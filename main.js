// var cities = [];

$('.search').on('click', function () {
  var city = $('#search-query').val();
  console.log(city);

  $('#search-query').val('');
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=783d76bf12b9784e1ed61aceec49558d&units=imperial`).then(function(response) {
    return response.json();
  })
  .then(function(data) {
  addCity(data);
  });
  $('#search-query').val('');
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=783d76bf12b9784e1ed61aceec49558d&units=imperial`).then(function(response) {
    return response.json();
  })
  .then(function(data) {
  addFiveDay(data);
  });
});

var addCity = function (data) {
  console.log('hello', data);
  var cities = [];
  cities.push({
    city: data.name,
    temperature: Math.round(data.main.temp),
    weather: data.weather[0].main,
    iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
})
  console.log(cities);
  renderCity(cities);
} 



var addFiveDay = function (data) {
  console.log('hello', data);
  var fiveDay = [];
  var daySelectionIndex = [3, 11, 19, 27, 35];
  for ( var i = 0; i < daySelectionIndex.length; i++) {
    var dayData = data.list[daySelectionIndex[i]];
    fiveDay.push({
      weather: dayData.weather[0].main,
      temperature: Math.round(dayData.main.temp),
      iconUrl: `http://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`,
      //  need to find javascript function to convert to day of the week!
      dayOfWeek: (new Date(dayData.dt)).getDay()
  })
  }
      console.log(fiveDay);
      renderFiveDay(fiveDay);
} 


 

var renderCity = function (cities) {
  $('.city').empty();

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
  
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(city);
  $('.city').append(newHTML);
  }
};

//  Need to complete this in the same format as renderCity
var renderFiveDay = function (fiveDay) {
  $('.five').empty();

  for (let i = 0; i < fiveDay.length; i++) {
    const city = fiveDay[i];
    var source = $('#fiveday-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city);
    $('.five').append(newHTML);     
  }
};

// var fetch = function (city) {
//   $.ajax({
//     method: 'GET',
//     url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=783d76bf12b9784e1ed61aceec49558d&units=imperial`,
//     dataType: 'json',
//     success: function (data) {
//       console.log(data);
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//     // method: 'GET', 
//     // url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=783d76bf12b9784e1ed61aceec49558d&units=imperial`,
//     // dataType: 'json',
//     // success: function (data) {
//     //   console.log(data);
//     // },
//     // error: function (jqXHR, textStatus, errorThrown) {
//     //   console.log(textStatus);
//     // }
  
//   })
// };

// renderCity();
