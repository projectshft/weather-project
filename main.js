//change the for loop code, avoid the same code in weather daily


 
$('#submit').on('click', function(){
    let nameOfCity = $('#cityName').val();
    
    fetchGeo(nameOfCity); 
    //this doesnt work.. i think it has something to do with the variable being protected by the function.
    // its more readable this way than calling fetchWeather inside of fetchGeo?
    //fetchWeather(newLat, newLon); 
    //renderWeather(); 
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
            //console.log(data);
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
    //console.log(data); 

    let weatherDaily = [ { dayOfTheWeek : [], temp : [], }, 
        { dayOfTheWeek : [], temp : [], }, 
        { dayOfTheWeek : [], temp : [], }, 
        { dayOfTheWeek : [], temp : [], }, 
        { dayOfTheWeek : [], temp : [], }, 
        ]; 

    let currentWeather = {temperture : data.current.temp};
    console.log(currentWeather.temperture); 

    //new array for the 48 hourly temp 
    let hourly = data.hourly.map(x => x.temp); 

    let everyHour = []; 

    //so j does not reset to 0 everytime the inner while loop is iterate
    j = 0;

    //48 temps, every 8 is for one day 
    for (let i = 0; i < hourly.length; i++) {
        everyHour.push(hourly[i]); 
        let reminderCheck = (i+1) % 8 ; 

        // if i+1 divided by 8, and the reminder is 0, get the average of the 8 temps
        if (reminderCheck === 0){
            let weatherOfTheDay = Math.round(everyHour.reduce((acc, curr) => acc + curr) / 8); 
            
            //push weather of the day into the weatherdaily object
            while (j < weatherDaily.length) {
                //debugger; 
                weatherDaily[j].temp.push(weatherOfTheDay);
                console.log(weatherDaily[j].temp[0]);
                j++; 
                break; 
            }
        
            //empty the yesterdays hours
            everyHour = []; 
        }
    }; 
appendWeather(currentWeather, weatherDaily);

}   

let appendWeather = function(currentWeather, weatherDaily) { 
    let source = $('#weather-table').html(); 
    let template = Handlebars.compile(source);
    let newHTML = template(currentWeather); 

    console.log(newHTML); 
    $('#weather-table').empty(); 
    $('#weather-table').append(newHTML); 

    for (let i = 0; i < weatherDaily.length; i++) {
        let newHTML2 = template(weatherDaily[i]); 
        console.log(newHTML2)
        $('#weather-table').append(newHTML2); 
    }
}; 


