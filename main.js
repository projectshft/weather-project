var weatherApp = function() {
  var currentData = {
    cityName: "",
    temperature: 0,
    forecast: "",
    iconurl: ""
  };

  var forecastData = [];

  var getCurrent = function(attribute) {
    return currentData[attribute];
  };

  var setCurrent = function(attribute,value) {
    currentData[attribute] = value;
  };

  var fetchData = function(query,dataType) {
    var APIkey = "&APPID=e915b1b5accb2008bf721504d13ae081";
    query = query.replace(" ","+");
    $.ajax({
      method: "GET",
      url: 'https://api.openweathermap.org/data/2.5/' + dataType + '?q=' + query + '&units=imperial' + APIkey,
      dataType: "json",
      success: function(data) {
        console.log('got data successfully');
        console.log(data);
        if (dataType === 'weather') {
          parseCurrentData(data);
        } else {
          parseForecastData(data);
        }
        renderData();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var parseCurrentData = function(data) {
    setCurrent('cityName', data.name);
    setCurrent('temperature',data.main.temp);
    setCurrent('forecast',data.weather[0].main);
    setCurrent('iconurl', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    console.log(currentData);
  };

  var parseForecastData = function(data) {
    forecastData = [];
    for(let i = 4; i <=36; i+=8) {
      console.log('i: ', i);
      var dayObj = {};
      dayObj.forecast =  data.list[i].weather[0].main;
      dayObj.temperature = data.list[i].main.temp;
      dayObj.iconurl = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png';
      dayObj.day = moment(data.list[i].dt_txt).format('dddd');
      console.log(dayObj);
      forecastData.push(dayObj);
    }
    console.log(forecastData);
  };

  var renderData = function() {
    //clear existing data
    $('.forecast-section').empty();
    $('.five-day').empty();
    //render current data in top section
    var forecastSource = $('#current-template').html();
    var forecastTemplate = Handlebars.compile(forecastSource);
    $('.forecast-section').append(forecastTemplate(currentData));
    //render five day forecast in lower section
    var fiveDaySource = $('#forecast-template').html();
    var fiveDayTemplate = Handlebars.compile(fiveDaySource);
    forecastData.forEach(day => $('.five-day').append(fiveDayTemplate(day)));
  };

  return {
    fetchData: fetchData,
  }
}

var app = weatherApp();

//fetch data when button is clicked
$('.search').click(function() {
  var userSearch = $('.city-input').val();
  app.fetchData(userSearch,'weather');
  app.fetchData(userSearch,'forecast');
})

//fix country code issue
//make display responsive
//add geolocation option
