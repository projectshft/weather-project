// add click function to search for a city and handle edge cases
// set up API calls for current weather and for single day forcast
//iterate through return values to pull out important data
//transpose any data that requires changing
//render html using handlebars

$('#search').click(function(event){
  event.preventDefault();
  let city = $('#citySearch').val();
  fetchData(city)
  fetchFiveDay(city);
})

let addCurrentWeather = function (data) {

  let currentWeather = {
    city: data.name,
    temperature: data.main.temp,
    conditions: data.weather[0].main,
    logo: data.weather[0].icon
  };
  console.log(currentWeather);

}

let addFiveDayWeather = function (data2){
  let fiveDayWeather = [];
  let todaysDate = moment().format();
  var actualDate = todaysDate.slice(0,10);
  for (i = 0; i < data2.list.length; i++) {
    let workingDate = data2.list[i].dt_txt;
    let workingDateParsed = workingDate.slice(0, 10);
    let workingDateTime = workingDate.slice(11,13);
    console.log();
    if(workingDateTime == 00) {
      let workingFiveDay = {
        temperature: data2.list[i].main.temp,
        conditions: data2.list[i].weather[0].main,
        logo: data2.list[i].weather[0].icon

      }
      fiveDayWeather.push(workingFiveDay)
    }

    //fiveDayWeather.push(data2.list[i].dt_txt);
    console.log(fiveDayWeather)
  }

  let dayOne = {
    temperature: data2.list[0].main.temp,
    conditions: data2.list[0].weather[0].main,
    logo: data2.list[0].weather[0].icon
  }
  console.log(fiveDayWeather);
}


let fetchData = function(city) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=dc4751020ac27d49bffd0f744199344f',
    dataType: 'jsonp',
    success: function(data) {
    addCurrentWeather(data)
    console.log(data);
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
  }
});
};

let fetchFiveDay = function(city) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&APPID=dc4751020ac27d49bffd0f744199344f',
    dataType: 'jsonp',
    success: function(data2) {
    addFiveDayWeather(data2);
    console.log(data2);
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
  }
});
};
