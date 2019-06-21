// open weather map *API key*: ed5a139b64c682afc125b2cec0f6c859
// api.openweathermap.org/data/2.5/weather?id=4464368&APPID=ed5a139b64c682afc125b2cec0f6c859
// https://api.openweathermap.org/data/2.5/weather?id=4464368&APPID=ed5a139b64c682afc125b2cec0f6c859
// https://api.openweathermap.org/data/2.5/weather?id=4464368&units=imperial&APPID=ed5a139b64c682afc125b2cec0f6c859

var apiKey = "ed5a139b64c682afc125b2cec0f6c859"; 
var $loading = $('#loader');

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
    template: Handlebars.compile($('#current-weather-template').html()), 

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

  console.log(JSON.stringify(data));
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
   };

var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: 'https://' + "api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + "&APPID=" + apiKey, 
        //"api.openweathermap.org/data/2.5/weather?q=" + query,
        //durham, nc ?id=4464368
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
    //var searchURI = encodeURIComponent(search);
    fetch(search); //searchURI);

    //var myCurrentWeatherModel = new CurrentWeatherModel(currentWeatherObject); //-Test
    //var myCurrentWeatherView = new CurrentWeatherView({ model: myCurrentWeatherModel});
    //$('#current-weather').append(myCurrentWeatherView.render().el); 
});
