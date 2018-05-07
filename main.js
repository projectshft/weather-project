const WeatherApp = (currentDiv, extendedDiv, template, key, units) => {
  let currentWeather = {};
  let extendedWeather = [];

  const fetchCurrent = (query) => {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/find?" + query + "&units=" + units + "&APPID=" + key,
      dataType: "json",
      success: function(data) {
        setCurrent(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  const fetchExtended = (query) => {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast/daily?" + query + "&units=" + units + "&APPID=" + key,
      dataType: "json",
      success: function(data) {
        setExtended(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  const setCurrent = (data) => {
    const myData = data.list[0];

    const temp = () => {
      if (myData.main.temp) {
        return Math.floor(myData.main.temp);
      } else {
        return null;
      }
    };

    const location = () => {
      if (myData.name) {
        return myData.name + ", " + myData.sys.country;
      } else {
        return null;
      }
    };

    const iconURL = () => {
      if (myData.weather[0].icon) {
        return 'http://openweathermap.org/img/w/' + myData.weather[0].icon + '.png';
      } else {
        return null;
      }
    };

    const condition = () => {
      if (myData.weather[0].main) {
        return myData.weather[0].main;
      } else {
        return null;
      }
    };

    currentWeather = {
      temp: temp(),
      location: location(),
      iconURL: iconURL(),
      condition: condition()
    };

    updateCurrentView();
  };

  const setExtended = (data) => {
    const myData = data.list;

    // if previous results are being stored, empty the array
    if (extendedWeather.length !== 0) {
      extendedWeather = [];
    }

    // returned object has 7 items and we only want 5
    for (let i = 0; i < 5; i++) {
      const temp = () => {
        if (myData[i].temp.day) {
          return Math.floor(myData[i].temp.day);
        } else {
          return null;
        }
      };

      const condition = () => {
        if (myData[i].weather[0].main) {
          return myData[i].weather[0].main;
        } else {
          return null;
        }
      };

      const iconURL = () => {
        if (myData[i].weather[0].icon) {
          return 'http://openweathermap.org/img/w/' + myData[i].weather[0].icon + '.png';
        } else {
          return null;
        }
      };

      const dayOfWeek = () => {
        if (myData[i].dt) {
          return formatTime.getDayName(myData[i].dt * 1000);
        } else {
          return null;
        }
      };

      const day = {
        temp: temp(),
        condition: condition(),
        iconURL: iconURL(),
        dayOfWeek: dayOfWeek()
      };

      extendedWeather.push(day);
    }
    updateExtendedView();
  };

  const updateCurrentView = () => {
    const $temp = currentDiv.find('.temp');
    const $location = currentDiv.find('.location');
    const $icon = currentDiv.find('.icon');
    const $condition = currentDiv.find('.condition');

    $temp.html(currentWeather.temp + '&deg;');
    $location.html(currentWeather.location);
    $icon.attr('src', currentWeather.iconURL);
    $condition.html(currentWeather.condition);
  };

  const updateExtendedView = () => {
    // clear previous results
    extendedDiv.empty();

    extendedWeather.forEach((arr, i) => {
      extendedDiv.append(template(extendedWeather[i]));
    });
  };

  return {
    fetchCurrent,
    fetchExtended
  }
};

// create instance of WeatherApp() with the appropriate parameters
const currentDiv = $('#current-weather');
const extendedDiv = $('#extended-weather');
const template = Handlebars.compile($('#day-template').html());
const key = '2698364f7fdf260cfb261fae0e4dfd0e';

const myWeatherApp = WeatherApp(currentDiv, extendedDiv, template, key, 'imperial');

// A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
$('#search').on('click', (e) => {
  e.preventDefault();

  const searchInput = $('#search-form input');
  const query = searchInput.val();

  // verify user entered a value
  if (searchInput.val()) {
    myWeatherApp.fetchCurrent('q=' + query);
    myWeatherApp.fetchExtended('q=' + query);
  }
  searchInput.val('');
});

// The user can use their current location to get weather results
$('#search-geolocation').on('click', (e) => {
  navigator.geolocation.getCurrentPosition(function(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    var query = 'lat=' + lat + '&lon=' + lon;

    myWeatherApp.fetchCurrent(query);
    myWeatherApp.fetchExtended(query);
  });
});
