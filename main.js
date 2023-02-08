let current = [
  {
    temp: 50,
    name: 'London',
    main: 'Coulds',
    iconURL: 'http://openweathermap.org/img/wn/10d@2x.png'
  }
];

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
    // reformat data from JSON to objects
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

const renderCurrentWeather = () => {
  $('.current').empty();

  for (let i=0; i < current.length; i++) {
    let source = $('#current-template').html();
    let resultTemplate = Handlebars.compile(source);

    let newWeather = resultTemplate(current[i]);
    $('.current').append(newWeather);
  }
};

renderCurrentWeather();