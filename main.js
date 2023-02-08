let current = [
  {
    temp: 50,
    name: 'London',
    main: 'Coulds',
    description: 'light clouds'
  }
];

$('.search').on('click', function () {
  let query = $('#search-query').val();

  //currentWeather(query);
  // clears input
  $('#search-query').val('');
})

const renderCurrentWeather = () => {
  $('.current').empty();

  for (let i=0; i < current.length; i++) {
    let source = $('#result-template').html();
    console.log(source);
    let resultTemplate = Handlebars.compile(source);

    let newWeather = resultTemplate(current[i]);
    $('.current').append(newWeather);
  }
};

renderCurrentWeather();