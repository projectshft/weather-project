
var weather={}
var fiveDays=[]

//Helping functions 
const upperFirstLetter=(str)=>{
  return str[0].toUpperCase()+str.slice(1)
}
const tempConvToFarenheit=(t)=>{return Math.round((t-273.15)*9/5+32)}
const tempConvToCelsius=(t)=>{return Math.round(t-273.15)}


$('.search').on('click', function () {
  var search = $('#search-query').val();
  geoCoding(search)
});

var geoCoding = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/geo/1.0/direct?q="+query+"&limit=1&appid=88f3a5b06c7349e901851ad64cc7758c",
    dataType: "json",
    success: function(data) {
      getLatLon(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var getLatLon = function(data){
  const latLon={
    lat:data[0].lat,
    lon:data[0].lon
  }
  getWeather(latLon)
  getFiveDays(latLon)
}

var getWeather =function (obj){
  const lat= obj.lat
  const lon= obj.lon
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=88f3a5b06c7349e901851ad64cc7758c",
    dataType: "json",
    success: function(data) {
      addWeather(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var addWeather=function(data){
  var temp = tempConvToCelsius(data.main.temp)
  var search = upperFirstLetter($('#search-query').val());
  var description=upperFirstLetter(data.weather[0].main)
  var icon=data.weather[0].icon
  var iconImageURL="https://openweathermap.org/img/wn/"+icon+"@2x.png"
  
  weather={}
  weather={
    temp: temp,
    city: search,
    description: description,
    iconImageURL: iconImageURL
  }
  renderWeather()
}

var renderWeather = function(){
  $(".weather").empty()
  var source=$("#weather-template").html()
  console.log(source)
  var template=Handlebars.compile(source)
  var newHTML=template(weather)
  console.log(newHTML)
  $(".weather").append(newHTML)
}

const getFiveDays=function(obj){
  const lat= obj.lat
  const lon= obj.lon
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=88f3a5b06c7349e901851ad64cc7758c&units=metric",
    dataType: "json",
    success: function(data) {
      addFiveDays(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  }); 
}

const addFiveDays=function(data){
  fiveDays=[]
  var dayOne=data.list[6]
  var dayTwo=data.list[14]
  var dayThree=data.list[22]
  var dayFour=data.list[30]
  var dayFive=data.list[38]


  fiveDays=[
    {
      descr: dayOne.weather[0].main,
      temp:  Math.round(dayOne.main.temp),
      icon:  "https://openweathermap.org/img/wn/"+dayOne.weather[0].icon+"@2x.png",
      day:   moment(dayOne.dt_txt).format('dddd')
    },
    {
      descr: dayTwo.weather[0].main,
      temp:  Math.round(dayTwo.main.temp),
      icon:  "https://openweathermap.org/img/wn/"+dayTwo.weather[0].icon+"@2x.png",
      day:   moment(dayTwo.dt_txt).format('dddd')
    },
    {
      descr: dayThree.weather[0].main,
      temp:  Math.round(dayThree.main.temp),
      icon:  "https://openweathermap.org/img/wn/"+dayThree.weather[0].icon+"@2x.png",
      day:   moment(dayThree.dt_txt).format('dddd')
    },
    {
      descr: dayFour.weather[0].main,
      temp:  Math.round(dayFour.main.temp),
      icon:  "https://openweathermap.org/img/wn/"+dayFour.weather[0].icon+"@2x.png",
      day:   moment(dayFour.dt_txt).format('dddd')
    },
    {
      descr: dayFive.weather[0].main,
      temp:  Math.round(dayFive.main.temp),
      icon:  "https://openweathermap.org/img/wn/"+dayFive.weather[0].icon+"@2x.png",
      day:   moment(dayFive.dt_txt).format('dddd')
    }
  ]
 renderFiveDays()
}

var renderFiveDays = function(){
  $(".five-days").empty()
  for (let i = 0; i < fiveDays.length; i++){
    var source=$("#fivedays-template").html()
    var template=Handlebars.compile(source)
    var newHTML=template(fiveDays[i])
    $(".five-days").append(newHTML)
  }
}