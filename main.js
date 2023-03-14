
$('#search').on('click', function(){
    var nameOfCity = $('#cityName').val();
    
    fetchGeo(nameOfCity); 
}); 
 
//fetch the lat and lon of the city
let fetchGeo = function(cityName) {
    $.ajax({
        method: "GET", 
        url:"http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid="
        + "cd9bd559cd2897b256a8925da31d52de", 
        dataType: "json", 
        success: function(data) { 
            var newLat = data[0].lat; 
            var newLon = data[0].lon; 
            fetchWeather(newLat, newLon); 
            
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown); 
        }, 
    })

}; 

//fetch the weather of the city
let fetchWeather = function(lat, lon){ 
    $.ajax({
        method: "GET",
        url:"https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + 
        "&units=metric&exclude=minutely&appid=cd9bd559cd2897b256a8925da31d52de",
        dataType: "json", 
        success: function(data) {
            renderWeather(data);  

          },
        error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        },
    }); 
}; 

//take the fetched data and loop through the 40 temps
let renderWeather = function(data) {  
    let weatherDaily = []; 
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayOfToday = (new Date(Date.now() + data.timezone_offset * 1000)).getUTCDay(); 
    
    //new array for the 48 hourly temp 
    let hourly = data.hourly.map(x => x.temp); 

    let everyHour = []; 

    let currentWeather = {
        temperture : Math.floor(data.current.temp) + "°", 
        today: dayNames[dayOfToday], 
        //city: nameOfCity,  
        icon: "https://openweathermap.org/img/wn/" + data.hourly[0].weather[0].icon + "@2x.png", 
    };


    //48 temps, every 8 is for one day 
    for (let i = 0; i < hourly.length; i++) {
        everyHour.push(hourly[i]); 
        let reminderCheck = (i+1) % 8 ;

        // if i+1 divided by 8, and the reminder is 0, get the average of the 8 temps
        if (reminderCheck === 0){
            let weatherOfTheDay = Math.round(everyHour.reduce((acc, curr) => acc + curr) / 8); 
            
            let weatherCondition = {
                condition: data.hourly[i].weather[0].main, 
                temperture: weatherOfTheDay + "°", 
                icon: "https://openweathermap.org/img/wn/" + data.hourly[i].weather[0].icon + "@2x.png", 
                //futureDays: dayNames[dayOfToday++] 
            }; 
            weatherDaily.push(weatherCondition); 

            //empty the yesterdays hours
            everyHour = []; 
        }
    }; 
appendWeather(currentWeather, weatherDaily);

}   

let appendWeather = function(currentWeather, weatherDaily) { 
    let source = $('#weather-template').html(); 
    let template = Handlebars.compile(source);
    let newHTML = template(currentWeather); 

    //console.log(newHTML); 
    $('.currentWeather').empty(); 
    $('.fiveDayWeather').empty(); 
    $('.currentWeather').append(newHTML); 

    for (let i = 0; i < weatherDaily.length; i++) {
        const newHTML2 = template(weatherDaily[i]); 
        //console.log(newHTML2)
        $('.fiveDayWeather').append(newHTML2); 
    }
}; 


