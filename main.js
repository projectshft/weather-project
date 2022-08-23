var weatherArray = [];
var data;
var forecast;
var dataArray = [];
var forecastArray = [];


$('.search-button').on('click', function () {
   var dis = $('#search-query').val();
   $('#search-query').empty();

   fetch(dis);
   addWeather(data);
   retrieve();
});

dltbtn = document.querySelector('.search-button');
var inputs = document.querySelectorAll('#search-query');

dltbtn.addEventListener('click', function () {
    inputs.forEach(input => input.value = '');
});

var addWeather = function (data) {
    console.log(data);
    
    var weatherObj = {
        temp: data.main.temp.toFixed(0) || null,
        city: data.name || null,
        condition: data.weather[0].main || null,
        icon: data.weather[0].icon || null
    };
    
    weatherArray.push(weatherObj);
    console.log(weatherArray);
    
    renderWeather();
    
};


var fetch = function (dis) {
    
    function callback(response) {
        data = response;
    };
    
    $.ajax({
        method: 'GET',
        async: false,
        url: `https://api.openweathermap.org/data/2.5/weather?q=${dis}&appid=2d270fa9d4af84e4f4d18960f8b63d66&units=imperial`,
        dataType: 'json',
        data: {'request': "", 'target': 'arrange_url', 'method': 'method_target'},
        success: function (data) {
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }, 
        
    });
    
};


var renderWeather = function() {
    $('.temp-call').empty();

    for (let i = 0; i < weatherArray.length; i++) {
      var weathers = weatherArray[i];

     var weatherTemplate = $('#weatherTemplate').html();   
     var template = Handlebars.compile(weatherTemplate);
     var newHTML = template(weathers);
     
     $('.temp-call').append(newHTML);
    };
    
};


var retrieve = function () {
    var lon = data.coord.lon;
    var lat = data.coord.lat;
 $.ajax({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=2d270fa9d4af84e4f4d18960f8b63d66&units=imperial`,
        dataType: 'json',
        success: function (forecast) {
            addForecast(forecast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        },  
    });
};

var addForecast = function(forecast) {
    console.log(forecast);
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;
    var sum4 = 0;
    var sum5 = 0;

    var avgArray1 = [forecast.list[0].main.temp, forecast.list[1].main.temp,
    forecast.list[2].main.temp, forecast.list[3].main.temp,
     forecast.list[4].main.temp, forecast.list[5].main.temp,
      forecast.list[6].main.temp, forecast.list[7].main.temp];

      for (let i = 0; i < avgArray1.length; i++) {
            sum1 += avgArray1[i];
        };
        var avg1 = sum1/avgArray1.length 

      var avgArray2 = [forecast.list[8].main.temp, forecast.list[9].main.temp,
    forecast.list[10].main.temp, forecast.list[11].main.temp,
     forecast.list[12].main.temp, forecast.list[13].main.temp,
      forecast.list[14].main.temp, forecast.list[15].main.temp];

      for (let i = 0; i < avgArray2.length; i++) {
        sum2 += avgArray2[i];
        };
        var avg2 = sum2/avgArray2.length

      var avgArray3 = [forecast.list[16].main.temp, forecast.list[17].main.temp,
    forecast.list[18].main.temp, forecast.list[19].main.temp,
     forecast.list[20].main.temp, forecast.list[21].main.temp,
      forecast.list[22].main.temp, forecast.list[23].main.temp];

      for (let i = 0; i < avgArray3.length; i++) {
        sum3 += avgArray3[i];
        };
        var avg3 = sum3/avgArray3.length

      var avgArray4 = [forecast.list[24].main.temp, forecast.list[25].main.temp,
    forecast.list[26].main.temp, forecast.list[27].main.temp,
     forecast.list[28].main.temp, forecast.list[29].main.temp,
      forecast.list[30].main.temp, forecast.list[31].main.temp];

      for (let i = 0; i < avgArray4.length; i++) {
        sum4 += avgArray4[i];
       };
       var avg4 = sum4/avgArray4.length

      var avgArray5 = [forecast.list[32].main.temp, forecast.list[33].main.temp,
    forecast.list[34].main.temp, forecast.list[35].main.temp,
     forecast.list[36].main.temp, forecast.list[37].main.temp,
      forecast.list[38].main.temp, forecast.list[39].main.temp];

      for (let i = 0; i < avgArray5.length; i++) {
        sum5 += avgArray5[i];
        };
        var avg5 = sum5/avgArray5.length

        var dt = forecast.list[3].dt;
    

    var changeTime = function(dayString) {
            var forecastDay = new Date(dayString);

            let weekDay = new Intl.DateTimeFormat('en-US',
            { weekday: 'long' }).format(forecastDay);
            return weekDay;
   
    };
      
    var forecastObjs = [{
        description: forecast.list[3].weather[0].description || null,
        foreTemp: avg1.toFixed(0) || null,
        foreIcon: forecast.list[3].weather[0].icon || null,
        day: changeTime(forecast.list[3].dt_txt)
    },

    {
        description: forecast.list[12].weather[0].description || null,
        foreTemp: avg2.toFixed(0) || null,
        foreIcon: forecast.list[12].weather[0].icon || null,
        day: changeTime(forecast.list[12].dt_txt)
    },

    {
        description: forecast.list[20].weather[0].description || null,
        foreTemp: avg3.toFixed(0) || null,
        foreIcon: forecast.list[20].weather[0].icon || null,
        day: changeTime(forecast.list[20].dt_txt)
    },

    {
        description: forecast.list[28].weather[0].description || null,
        foreTemp: avg4.toFixed(0) || null,
        foreIcon: forecast.list[28].weather[0].icon || null,
        day: changeTime(forecast.list[28].dt_txt)
    },

    {
        description: forecast.list[39].weather[0].description || null,
        foreTemp: avg5.toFixed(0) || null,
        foreIcon: forecast.list[39].weather[0].icon || null,
        day: changeTime(forecast.list[39].dt_txt)
    }];

    forecastArray.push(forecastObjs);
    renderForecast();
    console.log(forecastArray);
};



var renderForecast = function() {
    $('.col-sm-5').empty();

    for (let i = 0; i < forecastArray.length; i++) {
      var forecasts = forecastArray[i];

     var forecastTemplate = $('#forecastTemplate').html();   
     var template2 = Handlebars.compile(forecastTemplate);
     var newHTML2 = template2(forecasts);
     
     $('.col-sm-5').append(newHTML2);
    };
};