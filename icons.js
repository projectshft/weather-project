var clear= "https://backgroundcheckall.com/wp-content/uploads/2017/12/weather-background-5.jpg"
var fewClouds = "https://thumbs.gfycat.com/BrownIllegalChafer-size_restricted.gif"
var scattered = "https://www.publicdomainpictures.net/pictures/260000/velka/cloudy-background.jpg"
var showers = "https://images.unsplash.com/photo-1523216406419-13246d50974f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
var rain = "http://bestanimations.com/Nature/Water/rain/rain-nature-animated-gif-19.gif"
var thunderstorm = "http://images6.fanpop.com/image/photos/40200000/Lightning-weather-40213883-750-422.gif"
var snow = "http://bestanimations.com/Nature/Water/rain/rain-nature-animated-gif-34.gif"
var mist = "https://media.giphy.com/media/VYNLM6Z3M5GUg/giphy.gif"
var other = "http://images5.fanpop.com/image/photos/30900000/supercell-weather-30965292-1440-900.jpg"



var selectIcon = function (icon) {
  if (icon == "01d" || icon == "01n") {
    var newIcon = "wi-day-sunny"
    // $("body").css("background-image" "url(clear)");
    return (newIcon)
  };
  if (icon == "02d" || icon == "02n") {
    var newIcon = 'wi-day-cloudy'
    // var newBackground = $("body").css(background-image: url(fewClouds))
    return (newIcon)
  };
  if (icon == "03d" || icon == "03n") {
    var newIcon = 'wi-cloud'
    // var newBackground = $("body").css(background-image: url(scattered))
    return (newIcon)
  };
  if (icon == "04d" || icon == "04n") {
    var newIcon = 'wi-cloudy'
    // var newBackground = $("body").css(background-image: url(scattered))
    return (newIcon)
  };
  if (icon == "09d" || icon == "09n") {
    var newIcon = 'wi-rain-wind'
    // var newBackground = $("body").css(background-image: url(showers))
    return (newIcon)
  };
  if (icon == "10d" || icon == "10n") {
    var newIcon = 'wi-raindrops'
    // var newBackground = $("body").css(background-image: url(rain))
    return (newIcon)
  };
  if (icon == "11d" || icon == "11n") {
    var newIcon = 'wi-lightning'
    // var newBackground = $("body").css(background-image: url(thunderstorm))
    return (newIcon)
  };
  if (icon == "13d" || icon == "13n") {
    var newIcon = 'wi-snowflake-cold'
    // var newBackground = $("body").css(background-image: url(snow))
    return (newIcon)
  };
  if (icon == "50d" || icon == "50n") {
    var newIcon = 'wi-smoke'
    // var newBackground = $("body").css(background-image: url(mist))
    return (newIcon, newBackground)
  } else {
    var newIcon = 'wi-alien'
    // var newBackground = $("body").css(background-image: url(other))
    return (newIcon)
  };
};

var newBackground = function(icon) {
  if (icon == 'wi-day-sunny') {
    return $("body").css("background-image", 'url('+ clear + ')');
  };
  if (icon == 'wi-day-cloudy' || icon == 'wi-cloud' ) {
    return $("body").css("background-image", 'url('+ fewClouds + ')');
  };
  if (icon == 'wi-cloudy') {
    return $("body").css("background-image", 'url('+ scattered + ')');
  };
  if (icon == 'wi-rain-wind' || icon == 'wi-raindrops') {
    return $("body").css("background-image", 'url('+ rain+ ')');
  };
  if (icon == 'wi-lightning') {
    return $("body").css("background-image", 'url('+ thunderstorm + ')');
  };
  if (icon == 'wi-snowflake-cold') {
    return $("body").css("background-image", 'url('+ snow + ')');
  };
  if (icon == 'wi-smoke') {
    return $("body").css("background-image", 'url('+ mist + ')');
  } else {
    return $("body").css("background-image", 'url('+ other + ')');
  };
};
