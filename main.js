const cityData = {};

const renderCityData = function () {
  $('.city-current').empty();

  const source = $('#city-template').html();
  const template = Handlebars.compile(source);
  const newHTML = template(cityData);

  $('.city-current').append(newHTML);
};

const gatherCityData = function (fullData) {
  const descriptionArr = fullData.weather[0].description.split(' ');
  const description = descriptionArr
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
  cityData.current = Math.round(fullData.main.temp);
  cityData.description = description;
  cityData.icon = fullData.weather[0].icon;

  renderCityData();
};

const fetch = function (query) {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=4da99895dae25ae39743d1996fb14942`,
    dataType: 'json',
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  }).done((data) => {
    if (data[0].country === 'US') {
      cityData.country = data[0].state;
    } else {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      cityData.country = regionNames.of(data[0].country);
    }

    cityData.name = data[0].name;

    const { lat } = data[0];
    const { lon } = data[0];

    return $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4da99895dae25ae39743d1996fb14942&units=imperial`,
      dataType: 'json',
      success(fullData) {
        console.log(fullData);
        gatherCityData(fullData);
      },
      error(jqXHRa, aTextStatus, anErrorThrown) {
        console.log(aTextStatus);
      },
    });
  });
};

const searchValueTrimmer = (query) => {
  const queryArr = query.split(',');
  const queryTrimmedArr = queryArr.map((index) => index.trim());
  const finalQuery = queryTrimmedArr.join(',');
  return finalQuery;
};

$('.search').on('click', () => {
  const search = $('#search-query').val();
  const searchTrimmed = searchValueTrimmer(search);

  fetch(searchTrimmed);

  $('#search-query').val('');
});

$('input').on('keypress', (e) => {
  const keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode === 13) {
    e.preventDefault();
    const search = $('#search-query').val();
    const searchTrimmed = searchValueTrimmer(search);
    console.log(searchTrimmed);
    fetch(searchTrimmed);

    $('#search-query').val('');
  }
});
