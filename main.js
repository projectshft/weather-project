const API_KEY = "eef46e88eea99fdfcbf3e442af90b863";
var $searchButton = $('#search-button');
var weatherTodaySource = $("#weather-today-template").html();
var weatherTodayTemplate = Handlebars.compile(weatherTodaySource);

var weatherFiveDaySource = $("#weather-five-day-template").html();
var weatherFiveDayTemplate = Handlebars.compile(weatherFiveDaySource);

//used to get day of week from UTC date in 5-day fetch
var daysOfWeek = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}

$searchButton.on('click', function() {
    //clear weather display containters
    $('.current-weather-container').empty()
    $('.five-day-weather-container').empty();
    //get value from searchbar and call function that will send requests to current & 5-day weather APIs after getting coordinates from city name
    searchVal = $('#search-val').val();
    fetchCoordinates(searchVal);
    //empty search bar
    $('#search-val').val(() => '');
});

//gets coordinates from city then fetches current and five day weather info upon coordinate-request success
    var fetchCoordinates = function(city) {
        // console.log('fetching coordinates')
        $.ajax({
            method: "GET",
            url: `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`,
            dataType: "json",
            success: function(data) {
                fetchCurrent(data[0].lat, data[0].lon, city);
                fetchFiveDay(data[0].lat, data[0].lon);
                // console.log(data);
                // console.dir(data);
            },
            failure: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

//fetch weather information for current day using latitude and longitude provided by successful fetchCoordinates request
var fetchCurrent = function(lat, lon, city) {
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        dataType: "json",
        success: function(currData) {
            // console.dir(currData);
            //fill out and append current weather template to current weather display container
            var weatherToday = weatherTodayTemplate({
                temperature: Math.round(currData.main.temp),
                city: city,
                weather: currData.weather[0].main,
                iconURL: `http://openweathermap.org/img/wn/${currData.weather[0].icon}@2x.png`
            });
            $('.current-weather-container').append(weatherToday);
        },
        failure: function(jqHXR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

//fetch five-day weather information using latitude and longitude provided by successful fetchCoordinates request
var fetchFiveDay = function(lat, lon) {
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        dataType: "JSON",
        success: function(data) {
            //create hash to separate weather data by date
            let dateHash = {};
            //keep track of number of days added to hash to stop looping through data after first 5 days of data are in the hash
            let dayCount = 0;
            //loop through items and put their info in corresponding date
            weatherDataLoop:
            for(let k = 0; k < data.list.length; k++) {
                //get month/day/year from weather data, create new Date object from it, get UTC date from that, then use daysOfWeek object to return the day of the week
                let date = new Date(data.list[k].dt_txt.slice(0,10));
                let day = daysOfWeek[date.getUTCDay()];
                //if date for item's weather data already in hash add current item to existing date, otherwise add date to hash and initialize with current item's data
                if(dateHash[day]) {
                    dateHash[day].temps.push(data.list[k].main.temp);
                    if(dateHash[day].highestWeatherSymbol < data.list[k].weather[0].icon.slice(0,2)) {
                        //keep track of highest value icon symbol data seen so most notable weather for the day is what is displayed for that day (if it's going to rain at any point that supersedes the hours of the day that would be clear, if it's going to thunderstorm that supersedes hours it would be raining, etc)
                        dateHash[day].highestWeatherSymbol = data.list[k].weather[0].icon.slice(0,2) + 'd';
                        dateHash[day].weather = data.list[k].weather[0].main
                    }
                } else {
                    //if current weather item is first for that day increase dayCount 
                    dayCount++;
                    if(dayCount > 5) {
                        //break out of loop once data for sixth day reached
                        break weatherDataLoop;
                    }
                    dateHash[day] = {
                        day: day,
                        //array to store all temps for that day so average can be taken and displayed for each day
                        temps: [data.list[k].main.temp],
                        highestWeatherSymbol: data.list[k].weather[0].icon.slice(0,2) + 'd',
                        weather: data.list[k].weather[0].main
                    }
                }
            }
            //create array to fill with relevant info for five-day template
            let fiveDayArr = [];
            for(let d in dateHash) {
                fiveDayArr.push({
                    day: d,
                    iconURL: `http://openweathermap.org/img/wn/${dateHash[d].highestWeatherSymbol}@2x.png`,
                    weather: dateHash[d].weather,
                    //average of all temperatures for the day
                    temperature: Math.round(dateHash[d].temps.reduce((prev, curr) => prev + curr) / dateHash[d].temps.length)
                });
            }
            console.dir(fiveDayArr);
            //fill out and append five-day weather template to five-day-weather display container
            let fiveDayResults = weatherFiveDayTemplate({'fiveDayArr': fiveDayArr});
            $('.five-day-weather-container').append(fiveDayResults);
        },
        failure: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}



