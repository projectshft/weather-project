//add the fetch function
var forecastFetch = function(query) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?q=${query},us&APPID=e5c41b556e0f143b4f3f8ea018a675ca`,
    dataType: "json",
    success: function(data) {
      //invoke myBAMFForecastEngine and assign the return obj to a new accessible object
      var newDaysObj = myBAMFForecastEngine(data);
      console.log('this is my returned fetch array: ', newDaysObj);
      //assign each index to it's own object to be used in it's own model
      var forecastTodayPlusOneModelRender = ForecastTodayPlusOneModel(newDaysObj.todayPlusOne);
      var forecastTodayPlusTwoModelRender = ForecastTodayPlusTwoModel(newDaysObj.todayPlusTwo);
      var forecastTodayPlusThreeModelRender = ForecastTodayPlusThreeModel(newDaysObj.todayPlusThree);
      var forecastTodayPlusFourModelRender = ForecastTodayPlusFourModel(newDaysObj.todayPlusFour);
      var forecastTodayPlusFiveModelRender = ForecastTodayPlusFiveModel(newDaysObj.todayPlusFive);
      //get the templates and assign via Handlebars
      var forecastTodayPlusOneTemplate = Handlebars.compile($('#dayPlusOne-template').html());
      var forecastTodayPlusTwoTemplate = Handlebars.compile($('#dayPlusTwo-template').html());
      var forecastTodayPlusThreeTemplate = Handlebars.compile($('#dayPlusThree-template').html());
      var forecastTodayPlusFourTemplate = Handlebars.compile($('#dayPlusFour-template').html());
      var forecastTodayPlusFiveTemplate = Handlebars.compile($('#dayPlusFive-template').html());
      //invoke the View and store the return value in vairable currentWeatherViewRender
      var forecastTodayPlusOneRender = ForecastView(forecastTodayPlusOneModelRender, forecastTodayPlusOneTemplate);
      var forecastTodayPlusTwoRender = ForecastView(forecastTodayPlusTwoModelRender, forecastTodayPlusTwoTemplate);
      var forecastTodayPlusThreeRender = ForecastView(forecastTodayPlusThreeModelRender, forecastTodayPlusThreeTemplate);
      var forecastTodayPlusFourRender = ForecastView(forecastTodayPlusFourModelRender, forecastTodayPlusFourTemplate);
      var forecastTodayPlusFiveRender = ForecastView(forecastTodayPlusFiveModelRender, forecastTodayPlusFiveTemplate);
      //clear elements to be rendered
      $(".my-five-day-top").empty();
      $(".my-five-day-two").empty();
      $(".my-five-day-three").empty();
      $(".my-five-day-four").empty();
      $(".my-five-day-five").empty();
      //append the HTML to the page
      $(".my-five-day-top").append(forecastTodayPlusOneRender.render());
      $(".my-five-day-two").append(forecastTodayPlusTwoRender.render());
      $(".my-five-day-three").append(forecastTodayPlusThreeRender.render());
      $(".my-five-day-four").append(forecastTodayPlusFourRender.render());
      $(".my-five-day-five").append(forecastTodayPlusFiveRender.render());
      //update background
      $('.my-five-day-row-top').css('style',"");
      $('.my-five-day-row-top').attr('style', "background-image:url(" + forecastTodayPlusOneModelRender.getAttributes().icon + ");");
      $('.my-five-day-row-two').css('style',"");
      $('.my-five-day-row-two').attr('style', "background-image:url(" + forecastTodayPlusTwoModelRender.getAttributes().icon + ");");
      $('.my-five-day-row-three').css('style',"");
      $('.my-five-day-row-three').attr('style', "background-image:url(" + forecastTodayPlusThreeModelRender.getAttributes().icon + ");");
      $('.my-five-day-row-four').css('style',"");
      $('.my-five-day-row-four').attr('style', "background-image:url(" + forecastTodayPlusFourModelRender.getAttributes().icon + ");");
      $('.my-five-day-row-five').css('style',"");
      $('.my-five-day-row-five').attr('style', "background-image:url(" + forecastTodayPlusFiveModelRender.getAttributes().icon + ");");
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//build the model that will hopefully be able to handle an array of incoming objects
//can't figure out how to get this to work... going to just build 5 different models.
// var ForecastModel = function(fetchArray){
//   fetchArray.forEach(function(index){
//     //initialize a "previous" attributes variable to be compared against the incoming one.
//     var previousAttributes = {};
//     //initialize a changeCallback to be updated with the render function upon prompt to change the view
//     var changeCallback = null;
//     //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
//     var initialize = function(){
//       Object.assign(previousAttributes, index);
//     };
//     var change = function(renderParam) {
//       changeCallback = renderParam;
//     };
//     //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
//     var getAttributes = function(){
//       return previousAttributes;
//     };
//     //invoke initialize to update the previousAttributes object
//     initialize();
//     console.log('this is the updated previousAttributes variable after initialize was invoked: ', previousAttributes);
//     console.log('this is the index variable after initialize was invoked: ', index);
//     return {
//       change,
//       getAttributes
//     };
//   });
// };

//add toayPlusOne's Model
var ForecastTodayPlusOneModel = function(fetchObject){
  //initialize a "previous" attributes variable to be compared against the incoming one.
  var previousAttributes = {};
  //initialize a changeCallback to be updated with the render function upon prompt to change the view
  var changeCallback = null;
  //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
  var initialize = function(){
    Object.assign(previousAttributes, fetchObject);
  };
  var change = function(renderParam) {
    changeCallback = renderParam;
  };
  //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
  var getAttributes = function(){
    return previousAttributes;
  };
  //invoke initialize to update the previousAttributes object
  initialize();
  console.log('this is the previousAttributes variable dayPlusOne: ', previousAttributes);
  console.log('this is the fetchObject variable dayPlusOne: ', fetchObject);
  return {
    change,
    getAttributes
  };
};

//add toayPlusTwo's Model
var ForecastTodayPlusTwoModel = function(fetchObject){
  //initialize a "previous" attributes variable to be compared against the incoming one.
  var previousAttributes = {};
  //initialize a changeCallback to be updated with the render function upon prompt to change the view
  var changeCallback = null;
  //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
  var initialize = function(){
    Object.assign(previousAttributes, fetchObject);
  };
  var change = function(renderParam) {
    changeCallback = renderParam;
  };
  //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
  var getAttributes = function(){
    return previousAttributes;
  };
  //invoke initialize to update the previousAttributes object
  initialize();
  console.log('this is the previousAttributes variable dayPlusTwo: ', previousAttributes);
  console.log('this is the fetchObject variable dayPlusTwo: ', fetchObject);
  return {
    change,
    getAttributes
  };
};

//add toayPlusThree's Model
var ForecastTodayPlusThreeModel = function(fetchObject){
  //initialize a "previous" attributes variable to be compared against the incoming one.
  var previousAttributes = {};
  //initialize a changeCallback to be updated with the render function upon prompt to change the view
  var changeCallback = null;
  //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
  var initialize = function(){
    Object.assign(previousAttributes, fetchObject);
  };
  var change = function(renderParam) {
    changeCallback = renderParam;
  };
  //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
  var getAttributes = function(){
    return previousAttributes;
  };
  //invoke initialize to update the previousAttributes object
  initialize();
  console.log('this is the previousAttributes variable dayPlusThree: ', previousAttributes);
  console.log('this is the fetchObject variable dayPlusThree: ', fetchObject);
  return {
    change,
    getAttributes
  };
};

//add toayPlusFour's Model
var ForecastTodayPlusFourModel = function(fetchObject){
  //initialize a "previous" attributes variable to be compared against the incoming one.
  var previousAttributes = {};
  //initialize a changeCallback to be updated with the render function upon prompt to change the view
  var changeCallback = null;
  //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
  var initialize = function(){
    Object.assign(previousAttributes, fetchObject);
  };
  var change = function(renderParam) {
    changeCallback = renderParam;
  };
  //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
  var getAttributes = function(){
    return previousAttributes;
  };
  //invoke initialize to update the previousAttributes object
  initialize();
  console.log('this is the previousAttributes variable dayPlusFour: ', previousAttributes);
  console.log('this is the fetchObject variable dayPlusFour: ', fetchObject);
  return {
    change,
    getAttributes
  };
};

//add toayPlusFive's Model
var ForecastTodayPlusFiveModel = function(fetchObject){
  //initialize a "previous" attributes variable to be compared against the incoming one.
  var previousAttributes = {};
  //initialize a changeCallback to be updated with the render function upon prompt to change the view
  var changeCallback = null;
  //define a function that will be used to update the previousAttributes object with the incom fetchAttributes object.
  var initialize = function(){
    Object.assign(previousAttributes, fetchObject);
  };
  var change = function(renderParam) {
    changeCallback = renderParam;
  };
  //define the getAttributes function that will return the now updated (after init has been executed) previousAttributes
  var getAttributes = function(){
    return previousAttributes;
  };
  //invoke initialize to update the previousAttributes object
  initialize();
  console.log('this is the previousAttributes variable dayPlusFive: ', previousAttributes);
  console.log('this is the fetchObject variable dayPlusFive: ', fetchObject);
  return {
    change,
    getAttributes
  };
};


//build the function that will determine the days based on the unix times, how far those days are in the future,
//calculate the daily high temps, and return the high temps, conditions tied to the high temps's index, and icons
//in an array of 5 objects.
var myBAMFForecastEngine = function(data){
  //initialize an array to hold all the relevant data
  var newData = [];
  //add the relevant data for each index in the newData array.
  data.list.forEach(function(index){
    var targetIconTemplate = iconToTemplates(index.weather[0].icon);
    //turn K to F and assign to new variable
    var tempF = Math.floor((index.main.temp - 273.15) * 9/5 + 32); //(tempK − 273.15) × 9/5 + 32
    newData.push({dayOfMonth: parseInt(moment(moment.unix(index.dt)).format('D')),
                  dayOfWeek: moment(moment.unix(index.dt)).format('dddd'),
                  temp: tempF,
                  condition: index.weather[0].description,
                  icon: targetIconTemplate
    });
  });
  //set currentDay variable to the current day of the month
  var currentDay = parseInt(moment().format('D'));

  //filter the newData array using the currentDay and set the result equal to new daily forecast arrays
  var todayPlusOneArray = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 1;
  });
  var todayPlusTwoArray = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 2;
  });
  var todayPlusThreeArray = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 3;
  });
  var todayPlusFourArray = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 4;
  });
  var todayPlusFiveArray = newData.filter(function(index){
    return index.dayOfMonth == currentDay + 5;
  });
  //note, if someone is checking the forecast between midnight and 3am, there will be no data for the fifth day.
  //I'm not addressing that right now...

  //pull out the 1pm object of every day's array and assign it to a new variable
  var todayPlusOne = todayPlusOneArray[4];
  var todayPlusTwo = todayPlusTwoArray[4];
  var todayPlusThree = todayPlusThreeArray[4];
  var todayPlusFour = todayPlusFourArray[4];
  var todayPlusFive = todayPlusFiveArray[4];

  return {
          todayPlusOne,
          todayPlusTwo,
          todayPlusThree,
          todayPlusFour,
          todayPlusFive
        };
};

//create the View for the current weather
//note, I'm about to use the same View to render 5 different models. Aaron said not to do this... but, Idk why
//it's necessary to make 5 identical views in this case.
var ForecastView = function(model, template) {
  //initialize the render function for the current weather
  var render = function(){
    var attributes = model.getAttributes();
    return template(attributes);
  };
  return {
    render
  };
}
