var cities = [];
var forecast = [];

$('.search').on('click', function(){
  cities = [];
  forecast = [];
  var city = $('#search-query').val()

  $('#search-query').val('');

  fetch(city)
})

var fetch = function(city){
  $.ajax({
    method: 'GET',
    url: 'https:/api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=9d09d0ac9e9eed9a59bbdcec2f73ef22&units=imperial',
    dataType: 'json',
    success: function(data){
      console.log(data)
      addCity(data)
      addWeek(data)
    },
    error: function (jqXHL, textStatus, errorThrown){
      console.log(textStatus);
    }
  })
}


var addCity = function(data){
  cities.push({
    temp: Math.floor(data.list[0].main.temp),
    city: data.city.name,
    description: data.list[0].weather[0].main,
    // icon: '"http://openweathermap.org/img/wn/"'+data.list[0].weather[0].icon +'.png'
  })
  renderCity()
}


var addWeek = function(data){
  

  forecast.push({
    temp: Math.floor(data.list[8].main.temp),
    description: data.list[8].weather[0].main,
    day: moment().add(1, 'day').format('dddd')
  },
  {
    temp: Math.floor(data.list[16].main.temp),
    description: data.list[16].weather[0].main,
    day: moment().add(2, 'days').format('dddd')
  },
  {
    temp: Math.floor(data.list[24].main.temp),
    description: data.list[24].weather[0].main,
    day: moment().add(3, 'days').format('dddd')
  },
  {
    temp: Math.floor(data.list[32].main.temp),
    description: data.list[32].weather[0].main,
    day: moment().add(4, 'days').format('dddd')
  },
  {
    temp: Math.floor(data.list[39].main.temp),
    description: data.list[39].weather[0].main,
    day: moment().add(5, 'days').format('dddd')
  })
  renderWeek()
  console.log(forecast)
}

var renderCity = function (){
$('.cities').empty();


  for(let i=0;i<cities.length;i++){
    var city = cities[i]
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city)

    $('.cities').append(newHTML);

  }
}

var renderWeek = function(){
  $('.five-day').empty();

  for (let i=0;i<forecast.length;i++){
    var day = forecast[i];

    var source = $('#five-day-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(day);

    $('.five-day').append(newHTML)
  }
}


//order of operations: get data, scrape data, push to array, append from array to html