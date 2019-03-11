//add the fetch function
var currentWeatherFetchCoords = function(lat, long) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=e5c41b556e0f143b4f3f8ea018a675ca`,
    dataType: "json",
    success: function(data) {
      //turn K to F and assign to new variable
      var tempF = Math.floor((data.main.temp - 273.15) * 9/5 + 32); //(tempK − 273.15) × 9/5 + 32
      //determine which BG to assign to "icon"
      var targetBG = iconToBG(data.weather[0].icon);
      //get the relevant data and add to new object
      var fetchAttributes = {
        city: data.name,
        temp: tempF,
        condition: 'with ' + data.weather[0].description,
        icon: targetBG
      };
      console.log('This is my fetch result: ', fetchAttributes);
      //invoke CurrentWeatherModel and store return value in variable currentWeatherModelRender
      var currentWeatherModelRender = CurrentWeatherModel(fetchAttributes);
      //retrieve and assign my HTML templates via handlebars
      var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html());
      var currentCityTemplate = Handlebars.compile($('#current-city-template').html());
      //invoke the View and store the return value in vairable currentWeatherViewRender
      var currentWeatherViewRender = CurrentWeatherView(currentWeatherModelRender, currentWeatherTemplate);
      var currentCityViewRender = CurrentWeatherView(currentWeatherModelRender, currentCityTemplate);
      //clear elements to be rendered
      $(".my-current-weather").empty();
      $(".display-location-text").remove();
      $(".display-location").empty();
      //append the HTML to the page
      $(".display-location").append(currentCityViewRender.render());
      $('.my-current-weather').append(currentWeatherViewRender.render());
      //update background
      $('.my-weather-container').css('style',"");
      $('.my-weather-container').attr('style', "background-image:url(" + currentWeatherModelRender.getAttributes().icon + ");");

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};


//create the model for the current weather
var CurrentWeatherModel = function(fetchAttributes) {
  //initialize a "previous" attributes variable to be compared against the incoming one.
  var previousAttributes = {};
  //initialize a changeCallback to be updated with the render function upon prompt to change the view
  var changeCallback = null;
  //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
  var initialize = function(){
    Object.assign(previousAttributes, fetchAttributes);
  };
  //I could put in a set function here to update the view only if there is a change a change vs the previous view
  //but I'm not entirely sure how I would go about doing that, and I don't think it's necessary, so I'm leaving that
  //out for now.

  //I could also create a get function here to grab specific keys, but I'm not yet sure how I would impliment that yet
  //so again, I'm leaving it out.

  //define the change function that will receive a render function as the argument
  var change = function(renderParam) {
    changeCallback = renderParam;
  };
  //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
  var getAttributes = function(){
    return previousAttributes;
  };
  //invoke initialize to update the previousAttributes object
  initialize();
  console.log('this is the updated previousAttributes variable after initialize was invoked: ', previousAttributes);
  console.log('this is the fetchAttributes variable after initialize was invoked: ', fetchAttributes);
  return {
    change,
    getAttributes
  };
};

//create the View for the current weather
//I'm again using the same view to render two different models...
var CurrentWeatherView = function(model, template) {
  //initialize the render function for the current weather
  var render = function(){
    var attributes = model.getAttributes();
    return template(attributes);
  };
  return {
    render
  };
}
