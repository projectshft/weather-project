// encapsulate moving parts into a module for better efficiency/durability/reusability
const projectWeatherAPI = () => {

// arrays that will hold the weather and forecast data for the searched city
    let weatherArray = [];
    let forecastArray1 = [];
    let forecastArray2 = [];
    let forecastArray3 = [];
    let forecastArray4 = [];
    let forecastArray5 = [];

// function to sort desired data from API and push it into the weather array
    let addWeatherEntries = (data) => {
        // convert the standard kelvin temp to fahrenheit 
        let degrees = Math.round((data.main.temp - 273.15) * 9/5 +32);
        // create a variable to grab the icon image for the weather type
        let weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        let weatherInfo = {
            degrees: degrees,
            cityState: data.name,
            conditions: data.weather[0].main,
            weatherIcon: weatherIcon

        }
            weatherArray.push(weatherInfo);
            
    };

    // function to sort desired info from API and push it into the correct forecast array
    let addForecastEntries = (info) => {
        // create variables inorder to properly calculate day of the week from timestamp
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let x1 = new Date(info.list[0].dt*1000);
        let x2 = new Date(info.list[8].dt*1000);
        let x3 = new Date(info.list[16].dt*1000);
        let x4 = new Date(info.list[24].dt*1000);
        let x5 = new Date(info.list[32].dt*1000);
        let dayOfWeek1 = days[x1.getDay()]
        let dayOfWeek2 = days[x2.getDay()]
        let dayOfWeek3 = days[x3.getDay()]
        let dayOfWeek4 = days[x4.getDay()]
        let dayOfWeek5 = days[x5.getDay()]
        // create 5 objects to seperate each forecast day of the week
        let forecastInfo1 = {
            conditions: info.list[0].weather[0].main,
            degrees: Math.round((info.list[0].main.temp - 273.15) * 9/5 + 32),
            weatherIcon: `http://openweathermap.org/img/wn/${info.list[0].weather[0].icon}@2x.png`,
            day: dayOfWeek1
        }    
        let forecastInfo2 = {
            conditions: info.list[8].weather[0].main,
            degrees: Math.round((info.list[8].main.temp - 273.15) * 9/5 + 32),
            weatherIcon: `http://openweathermap.org/img/wn/${info.list[8].weather[0].icon}@2x.png`,
            day: dayOfWeek2          
        }
        let forecastInfo3 = {
            conditions: info.list[16].weather[0].main,
            degrees: Math.round((info.list[16].main.temp - 273.15) * 9/5 + 32),
            weatherIcon: `http://openweathermap.org/img/wn/${info.list[16].weather[0].icon}@2x.png`,
            day: dayOfWeek3   
        }
        let forecastInfo4 = {
            conditions: info.list[24].weather[0].main,
            degrees: Math.round((info.list[24].main.temp - 273.15) * 9/5 + 32),
            weatherIcon: `http://openweathermap.org/img/wn/${info.list[24].weather[0].icon}@2x.png`,
            day: dayOfWeek4        
        }
        let forecastInfo5 = {
            conditions: info.list[32].weather[0].main,
            degrees: Math.round((info.list[32].main.temp - 273.15) * 9/5 + 32),
            weatherIcon: `http://openweathermap.org/img/wn/${info.list[32].weather[0].icon}@2x.png`,
            day: dayOfWeek5       
        }
        forecastArray1.push(forecastInfo1);
        forecastArray2.push(forecastInfo2);
        forecastArray3.push(forecastInfo3);
        forecastArray4.push(forecastInfo4);
        forecastArray5.push(forecastInfo5);

    }
   
  // function to render all content from the arrays to the view  
  let renderWeatherForecast = () => {
        // ensure that the weather and forecast div are cleared out before every render 
        $('.weather').empty();
        $('.forecast').empty();
        // loop through the weather array and append the info into our HTML file using handlebars
        for (let i=0; i<weatherArray.length; i++) {
            let weatherInfo = weatherArray[i];
            let source = $('#weather-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(weatherInfo);
            $('.weather').append(newHTML);
        }
        // loop through each forecast array and append the info into our HTML using handlebars
        for (let i=0; i<forecastArray1.length; i++) {
            let forecastInfo1 = forecastArray1[i];
            let source = $('#forecast-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(forecastInfo1);
            $('.forecast').append(newHTML);
        }
        for (let i=0; i<forecastArray2.length; i++) {
            let forecastInfo2 = forecastArray2[i];
            let source = $('#forecast-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(forecastInfo2);
            $('.forecast').append(newHTML);
        }
        for (let i=0; i<forecastArray3.length; i++) {
            let forecastInfo3 = forecastArray3[i];
            let source = $('#forecast-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(forecastInfo3);
            $('.forecast').append(newHTML);
        }
        for (let i=0; i<forecastArray4.length; i++) {
            let forecastInfo4 = forecastArray4[i];
            let source = $('#forecast-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(forecastInfo4);
            $('.forecast').append(newHTML);
        }
        for (let i=0; i<forecastArray5.length; i++) {
            let forecastInfo5 = forecastArray5[i];
            let source = $('#forecast-template').html();
            let template = Handlebars.compile(source);
            let newHTML = template(forecastInfo5);
            $('.forecast').append(newHTML);
        }
         // empty out the arrays in order to not have duplicate posts on the page when search is clicked again
         weatherArray = [];
         forecastArray1 = [];
         forecastArray2 = [];
         forecastArray3 = [];
         forecastArray4 = [];
         forecastArray5 = [];
    };
 
    // utilize the weather and forecast endpoints to get the current weather/5 day forecast based on the search parameters
    const fetch = function (query) {
        $.ajax({
            method: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=5a31d79a77b97402b850d4f7196d3274`,
            dataType: "json",
            success: function(data) {
            addWeatherEntries(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
            alert('Please enter a valid city name')
            }
        });
        $.ajax({
            method: "GET",
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${query}&APPID=5a31d79a77b97402b850d4f7196d3274`,
            dataType: "json",
            success: function(info) {
            addForecastEntries(info);
            renderWeatherForecast();
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

// on click return the information from the API endpoints
$('.search').on('click', function () {
    const search = $('#search-query').val();
   
    app.fetch(search);
    // reset search bar to default after each search
    $('form').find('input').val('');
    
});
