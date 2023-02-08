let current = [];

$('.search').on('click', function () {
  let query = $('#search-query').val();

  currentWeather(query);

  // clears input
  $('#search-query').val('');
})

const currentWeather = (query) => {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=4df43207cfa7a1f67f6f7fbd99044f1c&units=imperial`,
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

const addCurrentWeather = (data) => {

  let currentWeather = {
    temp: data.main.temp,
    name: data.name,
    main: data.weather[0].main,
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  }

  current.push(currentWeather);
  renderCurrentWeather();
}

const renderCurrentWeather = () => {
  // empty current weather div
  $('.current').empty();

  for (let i=0; i < current.length; i++) {
    let source = $('#current-template').html();
    let resultTemplate = Handlebars.compile(source);

    let newWeather = resultTemplate(current[i]);
    $('.current').append(newWeather);
  }

  // empty current weather array
  current = [];
};