$(".search").click(function () {
  let $city = $("#search-query").val();
  $("#search-query").val("");

  fetch1($city);
  fetch2($city);
});

$(".btn-outline-info").click(function () {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      fetch_lat_long(lat, long);
      fetch_lat_long_forecast(lat, long);
    },
    function () {
      alert("Can't not locate your position");
    }
  );
});

const addWeather = function (data) {
  weather = [];

  let w = {
    temp1: Math.round(data.main.temp),
    name1: data.name,
    main1: data.weather[0].main,
    icon_url1: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
  weather.push(w);

  renderWeather();
};

const fetch1 = function (city) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=66ec2e16b641899c740be1ca99a85a8a&units=imperial`,
    dataType: "json",
    success: function (data) {
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

const fetch_lat_long = function (latitude, longitude) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=66ec2e16b641899c740be1ca99a85a8a&units=imperial`,
    dataType: "json",
    success: function (data) {
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

const renderWeather = function () {
  $(".weathers").empty();

  for (let i = 0; i < weather.length; i++) {
    const ele = weather[i];

    $(".weathers").append(
      Handlebars.compile($("#weather-template").html())(ele)
    );
  }
};

renderWeather();
