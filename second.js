// variables to construct URLs
var urlBase = "https://api.openweathermap.org/data/2.5/"
var weatherSpecification = "weather?q="
var forecastSpecification = "forecast?q="
// var userInput = ""
var usaDefault = ",us"
var addApi = "&APPID="
var apiKey = "985d9c3253175620ace1a6c1be90b36d"
var unitsSpecification = "&units="
var imperialUnits = "imperial"
var metricUnits = "metric"

// these variables combined allow for both the current weather and the forecast to be selected
var forecastInputValues = urlBase + forecastSpecification
var currentWeatherInputValuesBase = urlBase + weatherSpecification
var defaultInputValueSpecifications = usaDefault + addApi + apiKey + unitsSpecification + imperialUnits

/////////////////////////////////////////////////

// this function allows for current or forecast weather queries to be made
// and pushed to their respective arrays
var weatherGetter = function(urlbase, query, array) {
   $.ajax({
      method: "GET",
      url: urlbase + query + defaultInputValueSpecifications,
      dataType: "json",
      success: function(data) {
         array.push(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
         console.log(textStatus);
      }
   });
};

/////////////////////////////////////////////////

// function to render current weather data to page
var renderCurrentWeather = function (data) {
  $('.weather').empty();
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({temperature: data[0].main.temp, city: data[0].name, weather: data[0].weather[0].main)
  $('.weather').append(newHTML);
};

// function to render weather forecast to page
var renderWeatherForecast = function (data) {
  $('.forecast').empty();
  var source = $('#forecast-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({weather1: data[0].weather[0].main, temp1: data[0].main.temp, icon1: , day1: ,
                          weather2: data[0].weather[0].main, temp2: data[0].main.temp, icon2: , day2: ,
                          weather3: data[0].weather[0].main, temp3: data[0].main.temp, icon3: , day3: ,
                          weather4: data[0].weather[0].main, temp4: data[0].main.temp, icon4: , day4: ,
                          weather5: data[0].weather[0].main, temp5: data[0].main.temp, icon5: , day5: )
  $('.forecast').append(newHTML);
};

/////////////////////////////////////////////////

let parsedWeatherData = [];

// this function extracts and formats day of week, hour/minute of day, temp, and weather description
var weatherFormatter = function(data) {
   for (let i = 0; i < data[0].list.length; i++) {
      let structuredData = {
         [i]: {
            // formats the dates down to days ex: 'Sunday', 'Monday'
            dayOfWeek: moment(data[0].list[i].dt_txt).format('dddd').toString(),
            // formats the hour and minute ex: '18:00'
            timeOfDay: moment(data[0].list[i].dt_txt).format('hh:mm').toString(),
            // gets all un-rounded temperature values
            temp: data[0].list[i].main.temp,
            // gets all weather descriptions ex: 'Sunny', 'Cloudy'
            weather: data[0].list[0].weather[0].main
         }
      };
      // pushes to data in global scope
      parsedWeatherData.push(structuredData);
   }
   // return data
}

/////////////////////////////////////////////////

// this object stores an array in each day, the first number in the array
// is the sum of all temperature values for that day of the week, the
// second value is the number of times that day was counted,
// the third is the mean temp
var dayOfWeekTemps = {
   sunday: [0, 0, 0],
   monday: [0, 0, 0],
   tuesday: [0, 0, 0],
   wednesday: [0, 0, 0],
   thursday: [0, 0, 0],
   friday: [0, 0, 0],
   saturday: [0, 0, 0],
};

// this function loops through the parsed and formatted 'parsedWeatherData' object
// and sums the temperatures for each day while counting the number of times
// each day appears
var dayTempAggregator = function(data) {
   for (let i = 0; i < data.length; i++) {
      if (data[i][i].dayOfWeek === "Sunday") {
         // add temperature value to dayOfWeekTemps.sunday
         dayOfWeekTemps.sunday[0] += data[i][i].temp
         // add count of appearance of 'Sunday'
         dayOfWeekTemps.sunday[1]++
      } else if (data[i][i].dayOfWeek === "Monday") {
         dayOfWeekTemps.monday[0] += data[i][i].temp
         dayOfWeekTemps.monday[1]++
      } else if (data[i][i].dayOfWeek === "Tuesday") {
         dayOfWeekTemps.tuesday[0] += data[i][i].temp
         dayOfWeekTemps.tuesday[1]++
      } else if (data[i][i].dayOfWeek === "Wednesday") {
         dayOfWeekTemps.wednesday[0] += data[i][i].temp
         dayOfWeekTemps.wednesday[1]++
      } else if (data[i][i].dayOfWeek === "Thursday") {
         dayOfWeekTemps.thursday[0] += data[i][i].temp
         dayOfWeekTemps.thursday[1]++
      } else if (data[i][i].dayOfWeek === "Friday") {
         dayOfWeekTemps.friday[0] += data[i][i].temp
         dayOfWeekTemps.friday[1]++
      } else if (data[i][i].dayOfWeek === "Saturday") {
         dayOfWeekTemps.saturday[0] += data[i][i].temp
         dayOfWeekTemps.saturday[1]++
      }
   }
}

// couldn't find a looped / nested loop solution to getting mean temperature values and
// rounding them, so doing it manually for now
var dailyWeatherAverages = function() {
   dayOfWeekTemps.sunday[2] = dayOfWeekTemps.sunday[0] / dayOfWeekTemps.sunday[1]
   dayOfWeekTemps.monday[2] = dayOfWeekTemps.monday[0] / dayOfWeekTemps.monday[1]
   dayOfWeekTemps.tuesday[2] = dayOfWeekTemps.tuesday[0] / dayOfWeekTemps.tuesday[1]
   dayOfWeekTemps.wednesday[2] = dayOfWeekTemps.wednesday[0] / dayOfWeekTemps.wednesday[1]
   dayOfWeekTemps.thursday[2] = dayOfWeekTemps.thursday[0] / dayOfWeekTemps.thursday[1]
   dayOfWeekTemps.friday[2] = dayOfWeekTemps.friday[0] / dayOfWeekTemps.friday[1]
   dayOfWeekTemps.saturday[2] = dayOfWeekTemps.saturday[0] / dayOfWeekTemps.saturday[1]

   var sundayMean = dayOfWeekTemps.sunday[2]
   var mondayMean = dayOfWeekTemps.monday[2]
   var tuesdayMean = dayOfWeekTemps.tuesday[2]
   var wednesdayMean = dayOfWeekTemps.wednesday[2]
   var thursdayMean = dayOfWeekTemps.thursday[2]
   var fridayMean = dayOfWeekTemps.friday[2]
   var saturdayMean = dayOfWeekTemps.saturday[2]

   sundayMean.toFixed(0)
   mondayMean.toFixed(0)
   tuesdayMean.toFixed(0)
   wednesdayMean.toFixed(0)
   thursdayMean.toFixed(0)
   fridayMean.toFixed(0)
   saturdayMean.toFixed(0)
}

/////////////////////////////////////////////////

var currentWeather = [];
var forecastWeather = [];

$('#theButton').on('click', function() {
   $('.weather').empty();
   var search = $('#city-query').val();
   weatherGetter(currentWeatherInputValuesBase, search, currentWeather)
   weatherGetter(forecastInputValues, search, forecastWeather)
   renderCurrentWeather(currentWeather)
   renderWeatherForecast(forecastWeather)
});
