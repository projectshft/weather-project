var weatherInfo = {};
var forecastInfo = [];
  
(".search-button").on('click', function () {
    var city = $("#city").val();
    fetch(city);
    fetchCurrentConditions(city);
    fetchFiveDayForecast(city);
})

$("#city").keyup(function (x) {
    if(x.key !== "Enter") return;
    $(".search-button").click();
})

var renderCurrentConditions = function() {
    document.querySelector('.current-weather').replaceChildren();
   
    const currentTemplate = `
    <div class="col-md 6 text-center current-weather">
        <h2>${weatherInfo.temperature}</h2>
        <h2>${weatherInfo.city}</h2>
        <h3>${weatherInfo.weatherConditions}</h3>
    </div>
    <div class="current-weather-icon col-md-6 text-center>
        <img src="${weatherInfo.weatherConditionsIcon}" alt="" class="img-fluid"/>
    </div>`

    document.querySelector('.current-weather').insertAdjacentHTML('beforeend', currentTemplate);


}

var renderForecast = function() {
    document.querySelector('.forecast').replaceChildren();

    for (let i = 0; i < forecast.length; i++) {
        const forecastInfo = forecast[i];
        
        const forecastTemplate = `
        <div class="col-md-2 text-center p-3 forecast">
            <h4>${forecastInfo.forecastedWeatherConditions}</h4>
            <h4>${forecastInfo.forecastedTemperature}</h4>
            <img src="${forecastInfo.forecastedWeatherConditionsIcon}" alt="" />
            <h4>${day}</h4>
        </div>`

        document.querySelector('.forecast').insertAdjacentHTML('beforeend', forecastTemplate);
    }
}
  
var fetchCurrentConditions = function(city) {
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a1bc4df9b4b205184fdc1a09a2d21f42`,
        dataType: "json",
        success: function (data) {
            weatherInfo = {};
            setWeatherInfo(data)
            renderCurrentConditions();
        },
    })
}

var fetchFiveDayForecast = function(city) {
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a1bc4df9b4b205184fdc1a09a2d21f42`,
        dataType: "json",
        success: function (data) {
            forecastInfo = [];
            setForecastInfo(data);
            renderForecast();
        },
    })
}
      
      
var setWeatherInfo = function(OpenWeatherdata) {
    weatherInfo.city = OpenWeatherdata.name;
    weatherInfo.temperature = Math.round((OpenWeatherdata.main.temp-273.15)*9/5+32);
    weatherInfo.weatherConditions = OpenWeatherdata.weather[0].description;
    weatherInfo.weatherConditionsIcon = `http://openweathermap.org/img/wn/${OpenWeatherdata.weather[0].icon}@2x.png`;
}

var setForecastInfo = function(OpenWeatherdata) {
    var currentTime = new Date();
    var currentDayOfWeek = currentTime.getDay();
    var allForecastPoints = OpenWeatherdata.list;

    for(let i = 0; i < 5; i++) {
        var selectedDay = currentDayOfWeek + i;
        selectedDay = selectedDay > 6 ? 0 : selectedDay;
    
        var forecastsForSelectedDay = allForecastPoints.filter(function (forecastPoint) {
            var forecastTime = new Date(forecastPoint.dt_txt)
      var forecastDayOfWeek = forecastTime.getDay();
      return forecastDayOfWeek === selectedDay
    })

    var highTemperature = forecastsForSelectedDay.reduce(function(currentHigh, forecastPoint) {
        var temperature = forecastPoint.main.temp
        return currentHigh >= temperature ? currentHigh : temperature;
      }, 0)
  
      var indexThreePM = forecastsForSelectedDay.findIndex(function(forecastPoint) {
        var forecastTime = forecastPoint.dt_txt.split(' ')[1];
        return forecastTime === '15:00:00'
      })
      indexThreePM = indexThreePM === -1 ? 0 : indexThreePM;
      var forecastedWeatherConditions = forecastsForSelectedDay[indexThreePM].weather[0].description;
      var forecastedWeatherConditionsIcon = forecastsForSelectedDay[indexThreePM].weather[0].icon;
  
  
      forecastInfo[i].forecastedTemperature = Math.round((highTemperature-273.15)*9/5+32);
      forecastInfo[i].forecastedWeatherConditions = forecastedWeatherConditions;
      forecastInfo[i].forecastedWeatherConditionsIcon = `http://openweathermap.org/img/wn/${forecastedWeatherConditionsIcon}@2x.png`
      var options = { weekday: 'long'};
      forecastInfo[i].day = new Intl.DateTimeFormat('en-US', options).format(new Date(forecastsForSelectedDay[0].dt_txt))
    }
}