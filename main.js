// open weather map *API key*: ed5a139b64c682afc125b2cec0f6c859
// api.openweathermap.org/data/2.5/weather?id=4464368&APPID=ed5a139b64c682afc125b2cec0f6c859
// https://api.openweathermap.org/data/2.5/weather?id=4464368&APPID=ed5a139b64c682afc125b2cec0f6c859
// https://api.openweathermap.org/data/2.5/weather?id=4464368&units=imperial&APPID=ed5a139b64c682afc125b2cec0f6c859

var apiKey = "ed5a139b64c682afc125b2cec0f6c859"; 
var $loading = $('#loader');

/*
var WeatherModel = Backbone.Model.extend({
    defaults: function() {
        return {
            location: '',
            day: '',
            temperature: 0,
            condition: ''
        }
    }
});
var WeatherView = Backbone.View.extend({
    template: Handlebars.compile($('#weather-template').html()),

    className: 'pane', 

    render: function () {
        this.$el.html(this.template(this.model.attributes));
    
        return this;
    }
});
var weatherTest = {
    location: 'Durham, NC',
    day: 'Friday',
    temperature: 88,
    condition: 'Cloudy'
}
*/

var CurrentWeatherModel = Backbone.Model.extend({
    defaults: function() {
        return {
            location: '',
            temperature: 0,
            condition: ''
        }
    }
});

var CurrentWeatherView = Backbone.View.extend({
    template: Handlebars.compile($('#weather-template').html()), //current-weather-template

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var currentWeatherObjectTest = {
    location: 'Durham, NC',
    temperature: 88,
    condition: 'Cloudy'
};

var addWeather = function (data) {
      var location = data.name || null;
      var temperature = data.main.temp ||  null;
      var condition = data.weather[0].main || null;

      var weatherObject = {
        location: location,
        temperature: temperature,
        condition: condition
      };
      console.log(JSON.stringify(weatherObject));

    var myTemplate = Handlebars.compile($('#current-weather-template').html()); 
    var myView = myTemplate(weatherObject); 
    $('#current-weather').html(myView);

    var myTemplate2 = Handlebars.compile($('#weather-template').html()); 
    var myView2 = myTemplate2(weatherObject); 
    $('.shelf').html(myView2);
    //$('.shelf').html(myView2);
    //return weatherObject;
   };

var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: 'https://' + "api.openweathermap.org/data/2.5/weather?id=4464368&units=imperial" + "&APPID=" + apiKey, 
        //"api.openweathermap.org/data/2.5/weather?q=" + query,
        dataType: "json",
        beforeSend: function() {
          $loading.html('<img src="ajax-loader.gif"/>');
          $loading.show();
        },
        success: function(data) {
          $loading.hide();
          addWeather(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
  };

$('.search').on('click', function () { 
    var search = $('#search-query').val();
    //var currentWeatherObject =  
    fetch(search);

   // console.log(currentWeatherObject);
   //console.log(JSON.stringify(currentWeatherObject));

    //var myTemplate = Handlebars.compile($('#current-weather-template').html()); 
    //var myView = myTemplate(currentWeatherObject); 
    //var myCurrentWeatherModel = new CurrentWeatherModel(currentWeatherObject); //currentWeatherObjectTest
    //var myCurrentWeatherView = new CurrentWeatherView({ model: myCurrentWeatherModel});

    //$('#current-weather').append(myView); //myCurrentWeatherView.render().el); 

    //var weatherModel = new CurrentWeatherModel(currentWeatherObjectTest); //weatherTest
    //var weatherView = new CurrentWeatherView({ model: weatherModel });
  
    //$('.shelf').append(weatherView.render().el)
});
