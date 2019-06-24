//weather API key TODO: create JS yaml to not expose key
var my_key = 'c8ff39d1982ba18e6de83f8d7febeb2b';

//weatherApp Model class
WeatherApp = function() {
  //data state
  var state = {
    //for current weather
    current: {
      temp: '', name: '', description: '', icon: ''
    },
    //for 5day forecast
    forecast: []
  }

  //our DOM jquery divs
  var $currentWeather = $('.current-weather');
  var $forecastWeather = $('.forecast-weather');

  //helper to take index from getDay() method and returns day of week
  var _getWeekday = function(dayNum){
    //array of days of week strings
    var weekdays = new Array(
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  );
    //return day of week string, based on sunday 0-index
    return weekdays[dayNum];
  }

  //helper to capitalize search query string
  var _capitalize = function(searchString){
    //array to join capitalized search term
    var capitalizedArray = [];
    //split string into array
    var searchCity = searchString.split(' ');
    //capitalize each letter for multiple words
    searchCity.forEach(word => {
      capitalizedArray.push(word.charAt(0).toUpperCase() + word.slice(1));
    });

    //return capitalized city
    return capitalizedArray.join(" ");
    
  }

  //find the city ID for more specific API query
  var _searchID = function(query){

    //array helper find to search citylist json file
    var found = data.find(function (element) {
      //TODO: allow option to search using comma-separation for the state
      return element.name == query;
    });

    //sending the ID back for URL interpolation
    if(found !== undefined){
      // console.log(found.id);
      return found.id;
    } else {

      //TODO: offer alternative city name to search
      alert(`Sorry, could not find your searched for city: ${query}. Please try again.`);
      return 4464368;
    }
    
  }
  
  //helper function to create URLs that we'll query
  var _createURL = function(query, type){
    //TODO: do we want to use city ID or something else?
    //check our type
    if(type === 'current'){
      //TODO: interpolate query term
      var weatherURL = `https://api.openweathermap.org/data/2.5/weather?id=${query}&units=imperial&appid=${my_key}`;
    } else if(type = 'forecast'){
      var weatherURL = `https://api.openweathermap.org/data/2.5/forecast?id=${query}&units=imperial&appid=${my_key}`;
    }
    //return our URL
    return weatherURL;
  }

  //helper function to fetch our API data
  var _fetchData = function(weatherURL){
    //fetch URLs for the api
    return fetch(weatherURL).then(response => response.json()).then(data => {
      //return Promise data
      return data;
    });
  }

  //helper function to set state
  var setState = async function (query) {
    //takes input parameter to know which state we're setting

    //take input parameter data to set that state, 
    //by grabbing the query string, finding the ID, and creating the search URL
    
    var currResult = await _fetchData(_createURL(_searchID(_capitalize(query)), 'current'));
    state.current = {
      'temp': currResult.main.temp,
      'name': currResult.name,
      'description': currResult.weather[0].description,
      'icon': `http://openweathermap.org/img/w/${currResult.weather[0].icon}.png`
    };

    //clear our current state's forecast
    state.forecast = [];

    //grab results for next 5 days
    var forecastResult = await _fetchData(_createURL(_searchID(_capitalize(query)), 'forecast'));

    forecastResult.list.forEach(forecastDay => {
      state.forecast.push({
        'temp': forecastDay.main.temp,
        'weekday': _getWeekday(new Date(forecastDay.dt_txt).getDay()),
        'description': forecastDay.weather[0].description,
        'icon': `http://openweathermap.org/img/w/${forecastDay.weather[0].icon}.png`
      });
    });

    //update html view for our search
    renderWeather();

  }

  //render the views for our state AKA where the magic happens
  var renderWeather = function(){

    //spin, because our call may take some time
    $('.fa-spinner').toggle();

    //grab our Handlebars templates
    var currentWeatherTemplate = Handlebars.compile($('#current-weather').html());
    var forecastWeatherTemplate = Handlebars.compile($('#forecast-weather').html());

    //assign our state to current weather view
    var currentWeatherView = weatherAppView(state.current, currentWeatherTemplate);
    
    //empty our weather DOM elements
    $currentWeather.empty();
    $forecastWeather.empty();
    //update with our state view
    $currentWeather.append(currentWeatherView.render());

    //update with our forecast view, looping through
    for(i=0; i < state.forecast.length; i+=8){
      //assign our day snapshot to forecast weather view
      var forecastWeatherView = weatherAppView(state.forecast[i], forecastWeatherTemplate);
      $forecastWeather.append(forecastWeatherView.render());
    }

  }

  //return our functions
  return {
    setState: setState
  }

};

//weatherApp View class
weatherAppView = function (model, template){
  //pass through model and render
  var render = function () {

    return template(model);
  }
  //return render
  return {
    render: render
  }
};

app = WeatherApp();

//handle click from search bar event
$('.main').on('click', '#search-button', function (e) {
  e.preventDefault();
  var city = $(this).parent().siblings('.form-control').val();
  app.setState(city);

});