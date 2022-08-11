let API_KEY = 'ffcbd48c376466c1987f4185ae974876'

$('#search-form').submit(function (e){
    e.preventDefault()

    let searchBar = document.getElementById('search-query')
    let search = $('#search-query').val()
    fetchLocation(search)
    searchBar.value = ''

})

let fetchLocation = function(query){
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${API_KEY}`,
    dataType: "json",
    success: function(data){
      
      let latitude = data[0].lat
      let longitude = data[0].lon
      
      fetchFiveDayForecast(latitude, longitude)
      fetchCurrentForecast(latitude, longitude)
      
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
}
  
let fetchFiveDayForecast = function(lat,lon){
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
    dataType: 'json',
    success: function(data){
      console.log(data.list)
      collateFiveDayData(data.list)
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
}

let fetchCurrentForecast = function(lat, lon){
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
    dataType: 'json',
    success: function(data){
      // console.log(data)
      renderCurrentForecast(data)
      setBgColor(data.weather[0].id)
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
}

let renderCurrentForecast = function(weatherData){
  $('.currentWeather').empty()
  let currentWeatherObj = {
    currentForecastDegrees:  weatherData.main.temp,
    currentForecastCity: weatherData.name,
    currentForecastCondition: weatherData.weather[0].description,
    currentForecastIcon: weatherData.weather[0].icon
  }

  let source = $('#current-forecast-template').html()
  let template = Handlebars.compile(source)
  let newHTML = template(currentWeatherObj)
  $('.currentWeather').append(newHTML)
}

let renderFiveDayForecast = function(fiveDayArray){
  $('.fiveDayWeather').empty()
  let week = []
  
  fiveDayArray.forEach(day => {
    let highs = []
    let lows = []
    
    for (let i = 0; i < day.length; i++) {
      const element = day[i];
      highs.push(element.fiveDayForecastHigh)
      lows.push(element.fiveDayForecastLow)
      var singleDayOfFiveForecast = {
        fiveDayForecastCondition: element.fiveDayForecastCondition,
        fiveDayForecastIcon: element.fiveDayForecastIcon,
        fiveDayForecastDay: element.fiveDayForecastDay,
        fiveDayForecastHigh: element.fiveDayForecastHigh,
        fiveDayForecastLow: element.fiveDayForecastLow
      }
      
      let high = highs.sort().reverse()
      let low = lows.sort()
      singleDayOfFiveForecast.fiveDayForecastHigh = high[0]
      singleDayOfFiveForecast.fiveDayForecastLow = low[0]
    }

    week.push(singleDayOfFiveForecast)
  })
  week.forEach(day=>{
    
    let source = $('#five-day-forecast-template').html()
    let template = Handlebars.compile(source)
    let newHTML = template(day)
    $('.fiveDayWeather').append(newHTML)
  })
}

let convertTime = function(utc){
  miliUtc = utc*1000
  let dayNum = parseInt(new Date(miliUtc).toLocaleString("en-US", {day: "numeric"}))
  let weekDay = new Date(miliUtc).toLocaleString("en-US", {weekday: "long"})
  return([dayNum, weekDay])
}

let collateFiveDayData = function(fiveDayData){
  let fiveDayWeatherObj = [[],[],[],[],[]]
  let today = (new Date().toLocaleString('en-US', {day:"numeric"}))
  let tomorrow = parseInt(today) + 1
  for (let i = 0; i < fiveDayData.length; i++) {

    const element = fiveDayData[i];
    let daysOut = convertTime(element.dt)[0] - tomorrow
    if(daysOut >= 0){
      fiveDayWeatherObj[daysOut].push({
        fiveDayForecastCondition: element.weather[0].description,
        fiveDayForecastHigh: element.main.temp_max,
        fiveDayForecastLow: element.main.temp_min,
        fiveDayForecastIcon: element.weather[0].icon,
        fiveDayForecastDay: convertTime(element.dt)[1]
        
      })
    }
  }
renderFiveDayForecast(fiveDayWeatherObj)
  
}

let setBgColor = function(weatherCode){

  if(weatherCode > 800){
    $("body").css({"background-image": "linear-gradient(#444488,#bbbbdd)"})
    $(".page-header").css({"color": "#DDD"})
  } else if (weatherCode === 800){
    $("body").css({"background-image": "linear-gradient(#71BDFF,#bbbbdd)"})
  } else if (weatherCode > 700){
    $("body").css({"background-image": "linear-gradient(#97a7b3,#bbbbdd)"})
  } else if (weatherCode >= 600 ){
    $("body").css({"background-image": "linear-gradient(#AAABB5,#bbbbdd)"})
  } else if (weatherCode >= 500){
    $("body").css({"background-image": "linear-gradient(#124B76,#bbbbdd)"})
    $(".page-header").css({"color": "#DDD"})
  }  else if (weatherCode >=300){
    $("body").css({"background-image": "linear-gradient(#405565,#bbbbdd)"})
    $(".page-header").css({"color": "#DDD"})
  }  else {
    $("body").css({"background-image": "linear-gradient(#131F29,#bbbbdd)"})
    $(".page-header").css({"color": "#DDD"})
  }


}
