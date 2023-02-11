let weather = [];

$('.search').on('click', function () {
  let sha = $('#search-query').val();
});

const renderWeather = function () {
  for (let i = 0; i < weather.length; i++) {
    const pattern = weather[i];

    let source = $('#weather-template').html();
    let template = Handlebars.compile(source);
    let newHTML = template(face);

    $('.weather').append(newHTML);
  }
};

renderWeather();