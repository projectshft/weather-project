// encapsulate moving parts into a module for better efficiency/durability/reusability
const projectWeatherAPI = () => {

// array that will hold the weather data for the searched city
    let weatherArray = [];

    let addWeatherEntries = function (data) {
        // convert the standard kelvin temp to fahrenheit 
        let degrees = data.main.temp
        degrees = Math.round((degrees - 273.15) * 9/5 + 32);
        // create a variable to grab the icon image for the weather type
        let weatherIcon = data.weather[0].icon;
        weatherIcon = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
        let weatherInfo = {
            degrees: degrees,
            cityState: data.name,
            conditions: data.weather[0].main,
            weatherIcon: weatherIcon

        }
            weatherArray.push(weatherInfo);
            
    };
        

    let renderWeather = () => {
        // ensure that the weather div is cleared out before every render 
        $('.weather').empty();
        // loop through the weather array and append the info into our HTML file using handlebars
        for (let i=0; i<weatherArray.length; i++) {
            let weatherInfo = weatherArray[i];
            let source = $('#weather-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(weatherInfo);
            $('.forecast').append(newHTML);
        }
         // empty out the weather array in order to not have duplicate posts on the page when search is clicked again
         weatherArray = [];
    };
    // utilize the weather API to get the current weather based on the search parameters
    const fetch = function (query) {
        $.ajax({
            method: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=5a31d79a77b97402b850d4f7196d3274`,
            dataType: "json",
            success: function(data) {
            addWeatherEntries(data);
            renderWeather();
            },
            error: function(jqXHR, textStatus, errorThrown) {
            alert('Please enter a valid city name')
            }
        });
    };

    return {
        fetch: fetch
    };

}

const app = projectWeatherAPI();


$('.search').on('click', function () {
    const search = $('#search-query').val();
   
    app.fetch(search);
    
});
