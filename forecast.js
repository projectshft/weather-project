// let forecast = [];

const addForecast = function (data) {
  forecast = [];

  const dataFiltered = data.list.filter(function (value, index, arr) {
    return index % 7 === 0;
  });

  for (let i = 1; i < dataFiltered.length; i++) {
    const ele = dataFiltered[i];
    let day = moment(ele.dt_txt, "YYYY-MM-DD").day();

    switch (day) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        break;
    }

    const f = {
      temp2: Math.round(ele.main.temp),
      main2: ele.weather[0].main,
      icon_url2: `http://openweathermap.org/img/wn/${ele.weather[0].icon}@2x.png`,
      day2: day,
    };
    forecast.push(f);
  }

  renderForecast();
};

const fetch2 = function (city) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=66ec2e16b641899c740be1ca99a85a8a&units=imperial`,
    dataType: "json",
    success: function (data) {
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

const fetch_lat_long_forecast = function (latitude, longitude) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=66ec2e16b641899c740be1ca99a85a8a&units=imperial`,
    dataType: "json",
    success: function (data) {
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

const renderForecast = function () {
  $(".forecasts").empty();
  for (let i = 0; i < forecast.length; i++) {
    const ele = forecast[i];

    $(".forecasts").append(
      Handlebars.compile($("#forecast-template").html())(ele)
    );
  }
};