var BetterWeather = {
  currentQuery: '',
  currentLocation: {},

  searchButton(){
    BetterWeather.defaultCity();
    $('.search-button').click(()=>{
      BetterWeather.inputFormat();
      BetterWeather.currentWeatherSearch();
      BetterWeather.forecastSearch();
    })
  },

  defaultCity(){
    if(localStorage.city){
      BetterWeather.currentQuery = localStorage.city;
      BetterWeather.currentWeatherSearch();
      BetterWeather.forecastSearch();
    }
  },

  inputFormat(){
    BetterWeather.currentQuery = $('#location-input').val();
    BetterWeather.currentQuery.toLowerCase();
    var capital = BetterWeather.currentQuery[0].toUpperCase();
    var lower = BetterWeather.currentQuery.slice(1).toLowerCase();
    BetterWeather.currentQuery = capital + lower;
    $('#location-input').val('');
  },

  accessCurrentLocation(){
    $('.location-button').click(()=>{
      navigator.geolocation.getCurrentPosition(
        (position) =>{ 
          BetterWeather.currentLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          }
          BetterWeather.searchCurrentLocation();
        },

        ()=>{
          $('.location-button').html('location disabled').removeClass('btn-success').addClass('btn-danger').off();
        }
      );
    })
  },

  searchCurrentLocation(){
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/find?lat=" + BetterWeather.currentLocation.lat + "&lon=" + BetterWeather.currentLocation.long + "&cnt=1&appid=0cc115d6b4190cb95525f9c0f6f2b58c&units=imperial",
      dataType: "json",
      success: function (data) {
        BetterWeather.currentQuery = data.list[0].name;
        BetterWeather.currentWeatherSearch();
        BetterWeather.forecastSearch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
   })
  },

  currentWeatherSearch(){
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + BetterWeather.currentQuery + "&appid=0cc115d6b4190cb95525f9c0f6f2b58c&units=imperial",
      dataType: "json",
      success: function (data) {
        BetterWeather.renderWeather(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
   })
  },

  renderWeather(data){
    $('.weather-container').empty();
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newItem = template({
      temp: Math.round(data.main.temp),
      city: data.name,
      weather: data.weather[0].main,
      icon: data.weather[0].icon
    })
    $('.weather-container').append(newItem);
    BetterWeather.checkCurrent();
    backgrounds.renderStyles(data.weather[0].main);
    BetterWeather.renderMaps();
  },

  renderMaps(){
    var source = $('#map-template').html();
    var template = Handlebars.compile(source);
    var newMap = template({location: BetterWeather.currentQuery});
    $('.map-container').append(newMap);
  },

  forecastSearch(){
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + BetterWeather.currentQuery + "&appid=0cc115d6b4190cb95525f9c0f6f2b58c&units=imperial",
      dataType: "json",
      success: function (data) {
        BetterWeather.forecast(data);
        },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    })
  },

  forecast(data){
    var fiveDay = data.list.filter(element=> element.dt_txt.includes('12:00:00'));
    BetterWeather.renderForecast(fiveDay);
  },

  renderForecast(fiveDay){
    $('.forecast-container').empty();
    fiveDay.forEach((day)=> {
      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newItem = template({
        temp: Math.round(day.main.temp),
        day: BetterWeather.dayRender(day.dt_txt),
        weather: day.weather[0].main,
        icon: day.weather[0].icon
      })
      $('.forecast-container').append(newItem)
    })
    $('.forecast-container').first().addClass("offset-md-3");
  },

  checkCurrent(){
    if (BetterWeather.currentQuery === localStorage.city){
      $('.set-as-default').html('remove default').off().click(()=>{
        BetterWeather.removeLocal()
      })
    } else {
      $('.set-as-default').click(() =>{
        BetterWeather.storeLocal(BetterWeather.currentQuery);
      });
    }
  },

  storeLocal(){
    localStorage.setItem('city', BetterWeather.currentQuery);
    $('.set-as-default').off().click(() =>{
      BetterWeather.removeLocal();
    })
    BetterWeather.checkCurrent();
  },

  removeLocal(){
    localStorage.clear();
    $('.set-as-default').html('set as default').off().click(() =>{
      BetterWeather.storeLocal(BetterWeather.currentQuery);
    })
    
  },
  
  dayRender(date){
    var dateObject = new Date(date);
    switch (dateObject.getDay()) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
    }
  }
}

BetterWeather.searchButton();
BetterWeather.accessCurrentLocation();