let weatherModel = [];
let weatherModel5 = [];

// on-load function to set default city
// need to trigger apiCall
// need to check if local storage has any value stored for default city
$(document).ready(function() {
    if (localStorage.defaultCity != undefined) {
        apiCall(localStorage.defaultCity)
    } else {
        return
    }
});

// search button event listener
$('#search').click(function () {
    let searchValue = $('#searchInput').val();
    console.log(searchValue.length)
    if (searchValue.length > 0) {
    apiCall(searchValue)
    } else {
        alert ('search bar can not be left empty before submitting')
    }
})

$(document).on('click', '.mainWeather', function () {
    console.log('click')
    let defaultCity = weatherModel[0].cityName;
    console.log(defaultCity);
    setDefaultCity(defaultCity);
})

//local storage feature for saving favorite city
const setDefaultCity = function(defaultCity) {
    localStorage.setItem('defaultCity', defaultCity)
}

// API call for current weather with key
// key  096f3282b86fa805756f58092f5d2481   4102008879dcae5fa2ce2d42e5bf66ba
var apiCall = function (searchVal) {
    weatherModel = [];
    setTimeout(function () {
        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&APPID=096f3282b86fa805756f58092f5d2481",
            dataType: "json",

            success: function (data) {
                // console.log(data)
                // console.log(data.weather[0].main) // rain
                // console.log('description ', data.weather[0].description)
                // //console.log('name ',data.name)
                // console.log('temperature ', data.main.temp) // kalvin to F  (280.24K − 273.15) × 9/5 + 32 = 44.762°F
                // console.log('icon search ', data.weather[0].icon)

                filteredData(data);
                apiCallFiveDay(searchVal)
                renderView(weatherModel)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                if (errorThrown == "Not Found") {
                alert ('City not found. Please try another city')
                } else {
                    console.log('error returned ', jqXHR, textStatus);
                    
                }
            }
        });
    }, 0);
};

// need API call for 5 days weather
var apiCallFiveDay = function (searchVal) {

    weatherModel5 = [];
    setTimeout(function () {
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?appid=096f3282b86fa805756f58092f5d2481&q=" + searchVal + "&units=imperial",
            dataType: "json",

            success: function (dataFive) {
                console.log('inside five call!! ', dataFive)

                var time = dataFive.list[0].dt_txt;
                const dayToFind = new Date(time)

                filterFiveDay(dataFive)
                renderView(weatherModel)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }, 0);
};

// need function to convert kalvin to farenhaight 
var kelvinToFar = function (temp) {
    return parseInt((temp - 273.15) * 9 / 5 + 32) // kalvin to F  (280.24K − 273.15) × 9/5 + 32 = 44.762°F
};

// way to store returned information and Model set up
const filteredData = function (mainData) {
    console.log('filter data mainData ',mainData.sys.country)
    var weatherObj = {};
    weatherObj["weather"] = mainData.weather[0].description;
    weatherObj["cityName"] = mainData.name;
    weatherObj["country"] = mainData.sys.country;
    weatherObj["temperature"] = kelvinToFar(mainData.main.temp);
    weatherObj["icon"] = "http://openweathermap.org/img/wn/" + mainData.weather[0].icon + "@2x.png";

    weatherModel.push(weatherObj);
    console.log('weather model inside filteredData ', weatherModel)
}
// function to sort out information and get only the one to display for 5 day forecast
const filterFiveDay = function (dataFive) {

    console.log('time5: ', dataFive.list[0].dt_txt)
    console.log('temperature5: ', dataFive.list[0].main.temp)
    console.log('weather5: ', dataFive.list[0].weather[0].main)
    console.log('icon5: ', dataFive.list[0].weather[0].icon)
    var dataTemp = [];
    for (var a = 4; a < dataFive.list.length; a = (a + 8)) {
        // console.log('inside five day filter ', dataFive.list[a])
        dataTemp.push(dataFive.list[a])
    };

    for (var i = 0; i < dataTemp.length; i++) {
        var weatherObjFive = {};
        weatherObjFive["time5"] = getDay(dataTemp[i].dt_txt);
        weatherObjFive["temperature5"] = dataTemp[i].main.temp;
        weatherObjFive["weather5"] = dataTemp[i].weather[0].main;
        weatherObjFive["icon5"] = "http://openweathermap.org/img/wn/" + dataTemp[i].weather[0].icon + "@2x.png";

        weatherModel5.push(weatherObjFive);
    }
    renderViewFive(weatherModel5)
};
// render function to display five day forecast
let renderViewFive = function (weatherModel5) {
    $('#five-day').empty();
    for (var i = 0; i < weatherModel5.length; i++) {
        var source = $('#five-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(weatherModel5[i]);
        $('#five-day').append(newHTML);
    }
}
// function or call to display information to view for single day
let renderView = function (weatherModel) {
    $('.mainWeather').empty();
    //console.log('renderView mainData value ', weatherModel)
    for (var i = 0; i < weatherModel.length; i++) {
        var source = $('#main-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(weatherModel[i]);
        $('.mainWeather').append(newHTML);
    }
  
};

// create function to convert date from API to current day.
// date formating, find day of the week
const getDay = function (dateToConvert) {
    var gsDayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wed',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    var d = new Date(dateToConvert);
    var dayName = gsDayNames[d.getDay()];
    //getDay will return the name of day
    return dayName
}

