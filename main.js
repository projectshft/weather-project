var weatherApp = function() {
  //initialize private variables for current & forecast weather data
  var currentData = {
    cityName: "",
    temperature: 0,
    forecast: "",
    iconurl: "",
    id: 0
  };
  var forecastData = [];
  //allows to set a default city & map location in local storage
  var currentCityId;
  var mapSearch = "";

  //toggles background picture depending on current conditions
  var backgroundImageClass = {
    condition2: "storm",
    condition3: "rain",
    condition5: "rain",
    condition6: "snow",
    condition7: "foggy",
    condition8: "cloudy"
  };

  //restrict the properties of the current data by using only getters & setters
  //these aren't strictly necessary, but they can be returned and used for testing
  var getCurrent = function(attribute) {
    return currentData[attribute];
  };

  var setCurrent = function(attribute, value) {
    currentData[attribute] = value;
  };

  //setter and getter for the string needed to search Google Maps API
  var getMapSearch = function() {
    return mapSearch;
  }

  var setMapSearch = function(string) {
    mapSearch = string;
  }

  //this checks to be sure that the five day forecast pulls data for noon each upcoming day
  var findIndexOfNoon = function(weatherArr) {
    var hourArr = weatherArr.map(reading => moment(reading.dt_txt).format('H'));
    return hourArr.indexOf("12");
  }

  //fetch current or forecast data from the open weather API based on a search (or ID for US only)
  var fetchData = function(query, dataType) {
    var APIkey = "&APPID=e915b1b5accb2008bf721504d13ae081";
    query = query.replace(" ", "+");
    $.ajax({
      method: "GET",
      url: 'https://api.openweathermap.org/data/2.5/' + dataType + '?' + query + '&units=imperial' + APIkey,
      dataType: "json",
      success: function(data) {
        //either gets the current weather or 5 day forecast
        if (dataType === 'weather') {
          parseCurrentData(data);
        } else if (dataType === 'forecast') {
          parseForecastData(data);
        }
        //after getting the data, render it to the page
        renderData();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        alert("An error has occurred, try another city");
      }
    });
  };

  //gets data from a US city name that can be cross referenced against the states returned from this API
  var fetchReverseGeo = function(coordSet, state, matchingCities) {
    var APIkey = "22f456ce1acc46ad848dcc9f1f09b19d";
    coordSet.forEach(set => {
      var url = 'https://geoservices.tamu.edu/Services/ReverseGeocoding/WebService/v04_01/Rest/?apiKey=' + APIkey + '&version=4.10&lat=' + set.lat + '&lon=' + set.lon + '&format=json';
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
          parseReverseGeoData(data, state, set.lat, matchingCities);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert("An error:", textStatus, "Try another city");
          console.log(textStatus);
        }
      });
    })
  };

  //assign the current weather properties to the queried city
  var parseCurrentData = function(data) {
    setCurrent('cityName', data.name);
    setCurrent('temperature', Math.round(data.main.temp));
    setCurrent('forecast', data.weather[0].main);
    setCurrent('iconurl', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    setCurrent('id', data.weather[0].id);
  };

  //assign the forecast properties for the queried city into 5 objects, 1 per day
  var parseForecastData = function(data) {
    forecastData = [];
    //make sure it's the 5 daytime forecasts (for noon) regardless of the time of the search
    var startIndex = findIndexOfNoon(data.list);
    for (let i = startIndex; i <= 39; i += 8) {
      var dayObj = {};
      dayObj.forecast = data.list[i].weather[0].main;
      dayObj.temperature = Math.round(data.list[i].main.temp);
      dayObj.iconurl = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png';
      dayObj.day = moment(data.list[i].dt_txt).format('dddd').slice(0, 3);
      forecastData.push(dayObj);
    }
    //get the id in case the user wants to set this city as default
    currentCityId = data.city.id;
  };

  /* This takes in all the possible US city matches and identifies the correct one based on user input state.
  It's necessary because the open weather API only allows for city name, country, lat, long, & id.
  This cross-references with a second API's data to check the latitude of all possibilies against a selected state.
  Example: Portland, ME, Portland, TX, or Portland, OR. Without this functionality, the Open Weather API would
  always return the first match for Portland, US, which is Portland, TX. Works for US only currently.
  */
  var parseReverseGeoData = function(data, state, lat, matchingCities) {
    //match the user selected state to the correct city in that state
    if (state === data.StreetAddresses[0].State) {
      //sort through the list of possibilites to find the one with matching latitude
      var matchingCity = matchingCities.find(city => city.coord.lat == lat);
      //get the id from that matched city in order to conduct the API search by ID.
      matchingIdStr = 'id=' + matchingCity.id;
      //get data for both current weather & forecast based on unique city ID.
      fetchData(matchingIdStr, 'weather');
      fetchData(matchingIdStr, 'forecast');
    }
  }
  //prints the current & forecast data to the page
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
    var conditionCode = 'condition' + Math.round(currentData.id / 100);
    //remove any previous image class and then apply the current condition
    $('body').removeClass();
    $('body').addClass(backgroundImageClass[conditionCode]);
  };

  //renders the map at the bottom of the page
  var renderMap = function(mapData) {
    $('.map-section').empty();
    //render the map in bottom section
    var mapSource = $('#map-template').html();
    var mapTemplate = Handlebars.compile(mapSource);
    $('.map-section').append(mapTemplate(mapData));
  }
  //used to set a city in local storage
  var getCurrentCityId = function() {
    return currentCityId;
  }

  //these are the only functions necessary outside the app
  return {
    fetchData: fetchData,
    fetchReverseGeo: fetchReverseGeo,
    renderMap: renderMap,
    getCurrentCityId: getCurrentCityId,
    getMapSearch: getMapSearch,
    setMapSearch: setMapSearch
  }
}

//initialize the app and city list to filter down to US only
var usaCityList;
var app = weatherApp();

$('document').ready(function() {
  //load the country options into the dropdown
  var countrySource = $('#country-dropdown-template').html();
  var countryTemplate = Handlebars.compile(countrySource);
  countryCodes.forEach(country => $('.country-code').append(countryTemplate(country)));
  //shrink the full city list to US cities only to get to a more manageable size
  usaCityList = cityList.filter(city => city.country === "US");
  //load the state options into the dropdown
  var stateSource = $('#state-dropdown-template').html();
  var stateTemplate = Handlebars.compile(stateSource);
  states.forEach(state => $('.state-code').append(stateTemplate(state)));
  //if there's a default city, fetch the data for it
  if (localStorage.getItem('defaultId')) {
    var cityId = localStorage.getItem('defaultId');
    var idStr = 'id=' + cityId;
    //get data for both current weather & forecast based on unique city ID.
    app.fetchData(idStr, 'weather');
    app.fetchData(idStr, 'forecast');
  }
  //if there's a default city, get the map for it
  if (localStorage.getItem('mapSearch')) {
    app.setMapSearch(localStorage.getItem('mapSearch'));
    app.renderMap({mapSearch: app.getMapSearch()});
  }
});

//fetch and render data when search button is clicked
$('.search').click(function() {
  var userSearch = $('.city-input').val();
  //make sure the user entered some text
  if (userSearch === "") {
    alert("Please enter a city name to search.")
  } else {
    //make sure it's in a title case format to match the existing data
    userSearch = _.startCase(userSearch);
    var mapSearch = "";
    //if it's a US city, then grab all the matching cities from the full US list
    if ($('.country-code').val() === "US") {
      var state = $('.state-code').val();
      var matchingCities = usaCityList.filter(city => city.name === userSearch);
      var sameCityCoords = [];
      //get all the lat/long coordinates for each option
      matchingCities.forEach(city => sameCityCoords.push(city.coord));
      //fetch the data which matches the city and state and set the map string to the right format
      app.fetchReverseGeo(sameCityCoords, state, matchingCities);
      app.setMapSearch(userSearch + "," + $('.state-code').val());
      //for now, if it's a non-US country, fetch the data based on only city name and country
      //TODO: eventually, add in Canadian provinces & other country considerations
    } else {
      //set the map string to the right format
      app.setMapSearch(userSearch + "+" + $('.country-code').val());
      //then fetch data for the city
      userSearch += "," + $('.country-code').val();
      app.fetchData('q=' + userSearch, 'weather');
      app.fetchData('q=' + userSearch, 'forecast');
    }
  }
  //render the Google Map with searched location
  app.renderMap({mapSearch: app.getMapSearch()});
})

//if a non-US country is selected, disable state dropdown
$('select[name="country"]').change(function() {
  if ($(this).val() !== "US") {
    $('.state-code').prop('disabled', true);
  } else {
    $('.state-code').prop('disabled', false);
  }
})

//use geolocation in browser to get user's coordinates and allow them to search their current location
$('.geolocation').click(function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var roundedLat = position.coords.latitude.toPrecision(8);
      var roundedLong = position.coords.longitude.toPrecision(8);
      var latLongStr = 'lat=' + roundedLat + '&lon=' + roundedLong;
      app.fetchData(latLongStr, 'weather');
      app.fetchData(latLongStr, 'forecast');
      app.renderMap({mapSearch: "+&center=" + roundedLat + "," + roundedLong});
    })
  } else {
    alert("Cannot find your current position, please enable geolocation or type in your city.")
  }
})

//enable a city to be saved to local storage by its ID value
$('.forecast-section').on('click', '#default', (function() {
  var currentCity = app.getCurrentCityId();
  var currentMapSearch = app.getMapSearch();
  localStorage.setItem('defaultId', currentCity);
  localStorage.setItem('mapSearch', currentMapSearch);
}));
