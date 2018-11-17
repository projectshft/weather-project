var weatherApp = function() {
  var currentData = {
    cityName: "",
    temperature: 0,
    forecast: "",
    iconurl: ""
  };

  var forecastData = [];
  var reverseGeoData = [];
  var usaCityList;


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
      url: 'https://api.openweathermap.org/data/2.5/' + dataType + '?' + query + '&units=imperial' + APIkey,
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

  var fetchReverseGeo = function(coordSet,state) {
    console.log('fetching reserve geo')
    var APIkey = 	"22f456ce1acc46ad848dcc9f1f09b19d";
    coordSet.forEach(set => {
      var url = 'https://geoservices.tamu.edu/Services/ReverseGeocoding/WebService/v04_01/Rest/?apiKey=' + APIkey + '&version=4.10&lat=' + set.lat + '&lon=' + set.lon + '&format=json';
      console.log(url);
    $.ajax({
      method: "GET",
      url: url,
      dataType: "json",
      success: function(data) {
        console.log('got data successfully');
        console.log(data);
        parseReverseGeoData(data,state, set.lat);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    })

    };

  var parseCurrentData = function(data) {
    setCurrent('cityName', data.name);
    setCurrent('temperature', Math.round(data.main.temp));
    setCurrent('forecast',data.weather[0].main);
    setCurrent('iconurl', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
  };

  var parseForecastData = function(data) {
    forecastData = [];
  //  var startIndex = data.list.indexOf(dt_txt)
    for(let i = 4; i <=36; i+=8) {
      var dayObj = {};
      dayObj.forecast =  data.list[i].weather[0].main;
      dayObj.temperature = Math.round(data.list[i].main.temp);
      dayObj.iconurl = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png';
      dayObj.day = moment(data.list[i].dt_txt).format('dddd');
      forecastData.push(dayObj);
    }
  };

  var parseReverseGeoData = function(data, state, lat) {
    console.log('parsing reverse geo data');
    if (state === data.StreetAddresses[0].State) {
      console.log('state match', state);
      console.log(lat);
      var matchingCity = sameCityList.find(city => city.coord.lat == lat);
      console.log(matchingCity);
      matchingIdStr = 'id=' + matchingCity.id;
      console.log(matchingIdStr);
      fetchData(matchingIdStr,'weather');
      fetchData(matchingIdStr, 'forecast');
    }
  //  console.log(possibleCity);
  //  reverseGeoData.push(possibleCity);
  }

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

  // var renderReverseGeoData = function() {
  //   console.log('rendering rev geo data');
  //  $('.forecast-section').empty();
  //   var reverseGeoSource = $('#reverse-geo-template').html();
  //   var reverseGeoTemplate = Handlebars.compile(reverseGeoSource);
  //   reverseGeoData.forEach(possibleCity => $('.forecast-section').append(reverseGeoTemplate(possibleCity)));
  // }

  return {
    fetchData: fetchData,
    fetchReverseGeo: fetchReverseGeo
  }
}

var app = weatherApp();

//when the document is ready, load the country code options into the dropdown
//and filter the full city list down to US cities only (to check against states)
$('document').ready(function() {
var countrySource = $('#country-dropdown-template').html();
var countryTemplate = Handlebars.compile(countrySource);
countryCodes.forEach(country => $('.country-code').append(countryTemplate(country)));
usaCityList = cityList.filter(city => city.country === "US");
var stateSource = $('#state-dropdown-template').html();
var stateTemplate = Handlebars.compile(stateSource);
states.forEach(state => $('.state-code').append(stateTemplate(state)));
});

//fetch data when button is clicked
$('.search').click(function() {
  var userSearch = $('.city-input').val();
  //make sure it's in a title case format
  userSearch = _.startCase(userSearch);
  //if it's a US city, then grab all the matching cities so we can check what state
if($('.country-code').val() === "US") {
  var state = $('.state-code').val();
  console.log(state);
  sameCityList = usaCityList.filter(city => city.name === userSearch);
  console.log(sameCityList);
  var sameCityCoords = [];
  //get all the lat/long coordinates for each option
  sameCityList.forEach(city => sameCityCoords.push(city.coord));
//  sameCityCoords.splice(2);
  console.log('same city coords',sameCityCoords);
  reverseGeoData = [];
  app.fetchReverseGeo(sameCityCoords,state);
  //for now, if it's another country, fetch the data based on only city name and country
  //TODO: eventually you would want to add in Canadian provinces & other country considerations
} else {
  userSearch += "," + $('.country-code').val();
  app.fetchData('q=' + userSearch,'weather');
  app.fetchData('q=' + userSearch,'forecast');
}

})

$('select[name="country"]').change(function() {
  if ($(this).val() !== "US") {
    $('.state-code').prop('disabled', true);
  } else {
    $('.state-code').prop('disabled', false);
  }
})
//
// var findDiffToNoon = function() {
//   var currentHour = new Date().getHours();
//   if (currentHour < 4) {
//     return
//   }
//   switch (currentHour) {
//     case :
//   }
// }

//decide on set/get functions or pushing directly
//error handling & edge cases
//fix time of day for forecast
//make display responsive
//add local storage (set as default)
//add geolocation option
//alter styling depending on current city
//add a map with the current location on google maps
//add nearby cities on google maps & let a user click a pin to change the city
//geocoding API key for Google: AIzaSyAhNv8W5Hr9-CcjnVCKEwfikaafcn21I80
