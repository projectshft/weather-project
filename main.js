"use strict";

/////////////////////////////////////////////////////
//Weather Projoect using an API from OpenWeather

//Variable to hold the weather and 5-day forecast data

var weather = [];
var forecast = [];
var city = "";

//FIRST PART FOR FETCHING & RENDERING CURRENT WEATHER CONDITIONS
//Get value from search input
$(".search").on("click", () => {
  city = $("#city-input").val();
  $("#status").text("");
  $("#map-link").text("");
  $("#city-input").val("");
  $(".map-divider").css("display", "block");
  $(".save-position").css("display", "block");
  fetch(city);
  fetchFiveDay(city);
});

//Fetch the data we want from the OpenWeather API-current weather
var fetch = function (city) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=5de1b63f3ad7c2600e3f33f10036d1ec`,
    dataType: "json",
    success: function (data) {
      addWeather(data);
      renderWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

//Add the data fetched to our weather array
//Start with emptying out our array
var addWeather = function (data) {
  weather = [];

  var currentConditions = {
    location: data.name || null,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description || null,
    imageURL:
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` ||
      `http://openweathermap.org/img/wn/01d@2x.png`,
    latitude: data.coord.lat,
    longitude: data.coord.lon,
  };

  weather.push(currentConditions);
  console.log("weather", weather);
};

var renderWeather = function () {
  //First emptying out whatever was in the current weather div
  $(".weather").empty();

  var latitude = parseFloat(weather[0].latitude);
  var longitude = parseFloat(weather[0].longitude);

  //Loop through to get info to compile
  for (var i = 0; i < weather.length; i++) {
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather[i]);
    $(".weather").append(newHTML);
  }

  initMap(latitude, longitude);
  iconSwap();
};

let marker;
function initMap(latitude = 0, longitude = 0) {
  var map;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: latitude, lng: longitude },
    zoom: 8,
  });

  marker = new google.maps.Marker({
    map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: { lat: latitude, lng: longitude },
  });
  marker.addListener("click", toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

////////////////////////////////////////////////////////////////////
//5--DAY_FORECAST

var fetchFiveDay = function (city) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=5de1b63f3ad7c2600e3f33f10036d1ec`,
    dataType: "json",
    success: function (data) {
      addForecast(data);
      renderForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

//Start to manipulate data
var addForecast = function (data) {
  //First to capture days and condition -lets convert the timestamp values to actual dates we can work with
  forecast = [];
  var days = [];
  var timezone = data.city.timezone;

  for (var i = 0; i < data.list.length; i++) {
    var dt = data.list[i].dt;
    var timezoneInMinutes = timezone / 60;
    const dateTime = moment.unix(dt).utc().add(timezoneInMinutes, "s");

    var dailyObj = {
      date: dateTime.toString(),
      temp: data.list[i].main.temp,
      icon: data.list[i].weather[0].icon,
      description: data.list[i].weather[0].description,
    };

    days.push(dailyObj);
  }

  //Looking at the data (which I fetched in the AM), it appears that some of these 3-hour time blocks are for THE CURRENT DAY, so I need to pull apart the data into the actual 5 days ahead.

  //First let's get a variable to represent 'today'
  const d = new Date().getDay();
  let today = moment().day(d).format("ddd");

  //Now create separate DAY-SPECIFIC arrays
  var dayOneData = [];
  var dayTwoData = [];
  var dayThreeData = [];
  var dayFourData = [];
  var dayFiveData = [];

  for (let i = 0; i < days.length; i++) {
    //Pulling out the object values so I can use array methods
    var daysArray = Object.values(days[i]);
    var dayData = {
      temp: daysArray[1],
      icon: daysArray[2],
      description: daysArray[3],
    };

    if (!daysArray[0].includes(today)) {
      if (daysArray[0].includes(moment().add(1, "days").format("ddd"))) {
        dayOneData.push(dayData);
      }
      if (daysArray[0].includes(moment().add(2, "days").format("ddd"))) {
        dayTwoData.push(dayData);
      }
      if (daysArray[0].includes(moment().add(3, "days").format("ddd"))) {
        dayThreeData.push(dayData);
      }
      if (daysArray[0].includes(moment().add(4, "days").format("ddd"))) {
        dayFourData.push(dayData);
      }
      if (daysArray[0].includes(moment().add(5, "days").format("ddd"))) {
        dayFiveData.push(dayData);
      }
    }
  }

  //Pushing all the day-specific arrays back into to a larger array so I can use one loop to get the data out for all the days;
  var dayArray = [];
  dayArray.push(dayOneData, dayTwoData, dayThreeData, dayFourData, dayFiveData);

  for (let i = 0; i < dayArray.length; i++) {
    let avgTemp = 0;
    let condition = "";
    //I wanted to capture the mid-day point but got errors once because when I fetched data in the AM, the 5th day had less than 4 weather points so had to add this code below to account for the timing of the 5th day data;
    if (dayArray[i][4]) {
      condition = dayArray[i][4].description;
    } else {
      condition = dayArray[i][0].description;
    }

    for (let j = 0; j < dayArray[i].length; j++) {
      avgTemp += dayArray[i][j].temp / dayArray[i].length;
    }

    //Note below that I included icons but they are BACK-UPs as I have other icons added in that are nicer. These are just in case i didn't capture the icon condition;
    forecast.push({
      temp: Math.round(avgTemp),
      description: condition || null,
      day: moment()
        .add(i + 1, "days")
        .format("dddd"),
      imageURL:
        `http://openweathermap.org/img/wn/${dayArray[i][3].icon}@2x.png` ||
        `http://openweathermap.org/img/wn/01d@2x.png`,
      date: moment()
        .add(i + 1, "days")
        .format("MMMM D"),
    });
  }
};

//Render the info we gathered
var renderForecast = function () {
  $(".forecast").empty();
  for (var i = 0; i < forecast.length; i++) {
    var source = $("#forecast-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast[i]);
    $(".forecast").append(newHTML);
  }

  tailorFiveDay();
};

////////////////////////////////////////////////////////////
//EXTRA STUFF ------------------------------------
/////////////////////////////////////////////////
//GEO-LOCATION BTN TO DISPLAY COORDINATES AND THE WEATHER AND MAP RIGHT IN THE BROWSER

$("#find-me").on("click", geoFindMe);

function geoFindMe() {
  var status = $("#status");
  var result = $("#find-result");

  $(result).text("");

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $(status).text("");

    $(result).text(
      `Latitude: ${Math.round(latitude)} °, Longitude: ${Math.round(
        longitude
      )} °`
    );

    initMap();
    fetchCity(latitude, longitude);
  }

  function error() {
    $(status).text("Unable to retrieve your location");
  }

  if (!navigator.geolocation) {
    $(status).text("Geolocation is not supported by your browser");
  } else {
    $(status).text("Locating…");
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

//Seperate fetch request to reverse engineer the city name from the latitude/longitude from Google's service above. Then feed that city into the current and 5-day forecast
var fetchCity = function (lat, lon) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=2&appid=5de1b63f3ad7c2600e3f33f10036d1ec`,
    dataType: "json",
    success: function (data) {
      fetch(data[0].name);
      fetchFiveDay(data[0].name);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

//Saving a default position and having it pop up on load for the user
$(".btn.save-position").on("click", function () {
  localStorage.setItem("city", city);
  $(".btn.save-position").css("display", "none");
});

window.onload = function () {
  var storedCity = localStorage.getItem("city", city);
  if (storedCity) {
    fetch(storedCity);
    fetchFiveDay(storedCity);
    $(".map-divider").css("display", "block");
  }
};

///Personalizing background of 5-day cards based on condition and adding new icons
var tailorFiveDay = function () {
  var conditions = $(".five-day-description");

  for (let i = 0; i < conditions.length; i++) {
    var text = $(conditions[i]).text();
    var iconDiv = $(conditions[i]).siblings(".icon").find(".icon-weather");

    if (text.includes("cloud")) {
      $(conditions[i]).closest(".col-sm").addClass("cloudy-style");
      $(iconDiv).attr("src", "./icon_images/overcast.png");
    }
    if (text.includes("sun") || text.includes("clear")) {
      $(conditions[i]).closest(".col-sm").addClass("sunny-style");
      $(iconDiv).attr("src", "./icon_images/sunny.png");
    }

    if (
      text.includes("rain") ||
      text.includes("storm") ||
      text.includes("drizzle")
    ) {
      $(conditions[i]).closest(".col-sm").addClass("stormy-style");
      $(iconDiv).attr("src", "./icon_images/rain.png");
    }

    if (text.includes("fog") || text.includes("mist")) {
      $(conditions[i]).closest(".col-sm").addClass("foggy-style");
      $(iconDiv).attr("src", "./icon_images/overcast.png");
    }

    if (text.includes("snow")) {
      $(conditions[i]).closest(".col-sm").addClass("snowy-style");
      $(iconDiv).attr("src", "./icon_images/snow.png");
    }
  }
};

//Tailor icons and background of current day

var iconSwap = function () {
  let description = $(".weather-description").text();
  if (description.includes("rain") || description.includes("drizzle")) {
    $(".main-icon").attr("src", "./icon_images/rain.png");
  }
  if (description.includes("snow")) {
    $(".main-icon").attr("src", "./icon_images/snow.png");
  }
  if (description.includes("sun") || description.includes("clear")) {
    $(".main-icon").attr("src", "./icon_images/sunny.png");
  }
  if (description.includes("cloud")) {
    $(".main-icon").attr("src", "./icon_images/overcast.png");
  }
  if (description.includes("partly cloud")) {
    $(".main-icon").attr("src", "./icon_images/partly_cloudy.png");
  }

  if (description.includes("thunder")) {
    $(".main-icon").attr("src", "./icon_images/rain_thunder.png");
  }

  if (description.includes("fog") || description.includes("mist")) {
    $(".main-icon").attr("src", "./icon_images/foggy.png");
  }
};
