//handlebars

    var currentWeather = {
        cityName: "London",
        temperature: 86,
        description: 'cloudy'
    };

    
   


var renderCurrentWeather = function () {
    for (var i = 0; i < currentWeather.length; i++) {
        
        var weather = currentWeather[i];
        var source = $('#weather-template').html();
        var template = Handlebars.compile(source)
        var weatherHTML= template({cityName:"chicago", temperature: 34, description: "rain"
        });
        $('#city').append(weatherHTML);
    }
};






// fetch applying user input to grab data from api



    //fetchCurrentWeather(search);
    // fetchForecast(search)
});



var fetchCurrentWeather = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&APPID=bb9deb8f222b9d0972270d0b7ea6fed4",
        dataType: "json",
        success: function (data) {

            currentWeather = {
                cityName: data.name,
                temperature: data.main.temp,
                description: data.weather[0].main
            }

            renderCurrentWeather();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

$('#search').on('click', function () {
    var search = $('#search-query').val();

console.log();

//use user input to grab data from api and display it in handlebars template

//1. user clicks button
//2. we grab city name input from form
//3. use fetch on api to collect City Name, Temperature, ad condition data 
//4. display data on webpage
//5. erase first city data on second search




//Part Two:
//1. after city input, grab 5 day forecast from api and display