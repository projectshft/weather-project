//add the fetch function
var forecastFetch = function(query) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?q=${query},us&APPID=e5c41b556e0f143b4f3f8ea018a675ca`,
    dataType: "json",
    success: function(data) {
      //invoke myBAMFForecastEngine
      myBAMFForecastEngine(data);







      // //get the relevant data and add to new object
      // var tempF = Math.floor((data.main.temp - 273.15) * 9/5 + 32); //(tempK − 273.15) × 9/5 + 32
      // var fetchAttributes = {
      //   city: query,
      //   temp: tempF + ' °F',
      //   condition: data.weather[0].description,
      //   icon: data.weather[0].icon
      // };




      // console.log('This is my fetch result: ', fetchAttributes);

      // //invoked CurrentWeatherModel and store return value in variable currentWeatherModelRender
      // var currentWeatherModelRender = CurrentWeatherModel(fetchAttributes);

      // //retrieve and assign my HTML templates via handlebars
      // var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html());
      // var currentCityTemplate = Handlebars.compile($('#current-city-template').html());

      // //invoke and store the return value in vairable currentWeatherViewRender
      // var currentWeatherViewRender = CurrentWeatherView(currentWeatherModelRender, currentWeatherTemplate);
      // var currentCityViewRender = CurrentWeatherView(currentWeatherModelRender, currentCityTemplate);

      // //clear elements to be rendered
      // $(".my-current-weather").empty();
      // $(".display-location-text").remove();
      // $("display-location").empty();

      // //append the HTML to the page
      // $(".display-location").append(currentCityViewRender.render());
      // $('.my-current-weather').append(currentWeatherViewRender.render());


    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//build the function that will determine the days based on the unix times, how far those days are in the future,
//calculate the daily high temps, and return the high temps, conditions tied to the high temps's index, and icons
//in an array of 5 objects.
var myBAMFForecastEngine = function(data){
  //initialize an array to hold all the relevant data
  var newData = [];
  //add the relevant data for each index in the newData array.
  data.list.forEach(function(index){
    newData.push({dayOfMonth: parseInt(moment(moment.unix(index.dt)).format('D')),
                  temp: index.main.temp,
                  condition: index.weather[0].description,
                  icon: index.weather[0].icon
    });
  });
  //set currentDay variable to the current day of the month
  var currentDay = parseInt(moment().format('D'));

  //filter the newData array using the currentDay and set the result equal to new daily forecast arrays
  var todayPlusOne = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 1;
  });
  var todayPlusTwo = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 2;
  });
  var todayPlusThree = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 3;
  });
  var todayPlusFour = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 4;
  });
  var todayPlusFive = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 5;
  });
  //note, if someone is checking the forecast between midnight and 3am, there will be no data for the fifth day.
  //I'm not addressing that right now...
  console.log(todayPlusOne);
  console.log(todayPlusTwo);
  console.log(todayPlusThree);
  console.log(todayPlusFour);
  console.log(todayPlusFive);

  console.log(iconToBG(todayPlusOne[0].icon));

  // var newBackgroundURL = iconToBG(todayPlusOne[0].icon);
  // $('.my-weather-container').css('style',"");
  // $('.my-weather-container').attr('style', "background:url(" + newBackgroundURL + ");");

};




// var determineIndexGet = function(data){
//   var tempArray = [];
//   var slicedArray = data.list.slice(0, 8);
//   console.log(slicedArray);
//   slicedArray.forEach(function(index){
//     tempArray.push(index.main.temp);
//   });
  // tempArray.reduce(function(accumulator, currentValue){
  //   if (currentValue > accumulator) {
  //     return currentValue;
  //   } else return accumulator;
  // });
// };
