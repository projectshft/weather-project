let temps = [];    
let averageTemp =[];
let conditions = []; 
let newConditions = [];    
let oneCondition = [];
let newIcons = [];
let oneIcon = [];



function clearSearch() {
  let $search = $('#search-query');
  $search.each( function(input) {
    $($search[input]).val('');
  })
}

function clearForecasts() {
  let $forecasts = $('.forecasts');
  $forecasts.empty();
}


let cities = [];


$('.search').on('click', function(e) {
  e.preventDefault();
  let city = $('#search-query').val();
  fetch(city);
  fetchForecast(city);
  $('#search.query').empty();
})


var addCity = function (data) {
  cities = [];

  let location = {
    city: data.name,
    temp: data.main.temp + ' °'
  };

  for (let i = 0; i < data.weather.length; i++) {
    const element = data.weather[i];
    let icon = element.icon;
    location.main = element.main;
    location.icon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  cities.push(location);

  renderCity();
};



let splitDays = function (temperatures, numDays) {
  let newTemps = [];
  averageTemp = [];

  for (i = 0; i < temperatures.length; i += numDays) {
      dayTemps = temperatures.slice(i, i + numDays);
      newTemps.push(dayTemps);
  }

for (let j = 0; j < newTemps.length; j++) {
  element = newTemps[j];
  let sum = element[0] + element[1] + element[2] + element[3] + element[4] + element[5] + element[6] + element[7];
  let average = (sum / 8).toFixed(2);
  averageTemp.push(average);
}
}


let findTemps = function(data) {
  temps = [];
  for (let i = 0; i < data.list.length; i++) {
    const element = data.list[i];
    let temperature = element.main.temp;

    temps.push(temperature);
  }
  splitDays(temps, 8);
}



var addCityForecast = function (data) {
  findTemps(data);
  findConditions(data);
    monday = [];
    tuesday = [];
    wednesday = [];
    thursday = [];
    friday = [];

    let mondayForecast = {
      main1: oneCondition[0],
      temp1: averageTemp[0] + ' °',
      icon1: `https://openweathermap.org/img/wn/${oneIcon[0]}@2x.png`,
      day: 'Monday'
    }
  
    let tuesdayForecast = {
      main1: oneCondition[1],
      temp1: averageTemp[1] + ' °',
      icon1: `https://openweathermap.org/img/wn/${oneIcon[1]}@2x.png`,
      day: 'Tuesday'
    }
  
    let wednesdayForecast = {
      main1: oneCondition[2],
      temp1: averageTemp[2] + ' °',
      icon1: `https://openweathermap.org/img/wn/${oneIcon[2]}@2x.png`,
      day: 'Wednesday'
    }
  
    let thursdayForecast = {
      main1: oneCondition[3],
      temp1: averageTemp[3] + ' °',
      icon1: `https://openweathermap.org/img/wn/${oneIcon[3]}@2x.png`,
      day: 'Thursday'
    }
  
    let fridayForecast = {
      main1: oneCondition[4],
      temp1: averageTemp[4] + ' °',
      icon1: `https://openweathermap.org/img/wn/${oneIcon[4]}@2x.png`,
      day: 'Friday'
    }

  
monday.push(mondayForecast);
tuesday.push(tuesdayForecast);
wednesday.push(wednesdayForecast);
thursday.push(thursdayForecast);
friday.push(fridayForecast);


renderForecast();
};


var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fd29eda782d2ed239fe8bc7bac217402&units=imperial`,
    dataType: 'json',
    success: function (data) {
      addCity(data);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};


var fetchForecast = function (city) {

  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=fd29eda782d2ed239fe8bc7bac217402&units=imperial`,
    dataType: 'json',
    success: function (data) {
      addCityForecast(data);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};


let splitIcons = function (icons, numDays) {
  newIcons = [];
  oneIcon = [];

  for (i=0; i < icons.length; i += numDays) {
      dayIcons = icons.slice(i, i + numDays);
      newIcons.push(dayIcons);
  }

  for (let j = 0; j < newIcons.length; j++) {
    const element3 = newIcons[j];
    oneIcon.push(element3[0]);
  }
}


let splitConditions = function (cond, numDays) {
  newConditions = [];
  oneCondition = [];
  for (i=0; i < cond.length; i += numDays) {
      dayConds = cond.slice(i, i + numDays);
      dayIcons = cond.slice(i, i + numDays);
      newConditions.push(dayConds);
  }

  for (let j = 0; j < newConditions.length; j++) {
    const element2 = newConditions[j];
    oneCondition.push(element2[0]);
  }
}


let findConditions = function (data) {
  conditions = [];
  let icons = [];
  for (let i = 0; i < data.list.length; i++) {
    const element = data.list[i];
    let weather = element.weather;

    for (let j = 0; j < weather.length; j++) {
      const element2 = element.weather[j];
      conditions.push(element2.main);
      icons.push(element2.icon);
    }
  }
  splitConditions(conditions, 8)
  splitIcons(icons, 8);
}



let monday = [];
let tuesday = [];
let wednesday = [];
let thursday = [];
let friday = [];



var renderForecast = function () {
  $('.forecasts').empty();
  for (let i = 0; i < monday.length; i++) {
    const element = monday[i]; 
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(element);
    $('.forecasts').append(newHTML);
  }

  for (let i = 0; i < tuesday.length; i++) {
    const element = tuesday[i]; 
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(element);
    $('.forecasts').append(newHTML);
  }

  for (let i = 0; i < wednesday.length; i++) {
    const element = wednesday[i]; 
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(element);
    $('.forecasts').append(newHTML);
  }

  for (let i = 0; i < thursday.length; i++) {
    const element = thursday[i]; 
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(element);
    $('.forecasts').append(newHTML);
  }

  for (let i = 0; i < friday.length; i++) {
    const element = friday[i]; 
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(element);
    $('.forecasts').append(newHTML);
  }
};



var renderCity = function () {
  $('.cities').empty();

  for (let i = 0; i < cities.length; i++) {
    const location = cities[i];
    
    var source = $('#city-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(location);
    $('.cities').append(newHTML);

    var source = $('#weather-icon-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(location);
    $('.cities').append(newHTML);

  }
  clearSearch();
};



