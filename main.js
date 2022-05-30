const cityData = {};

const fetch = function (query) {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=4da99895dae25ae39743d1996fb14942&units=imperial`,
    dataType: 'json',
    success(data) {
      console.log(data);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
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
  console.log(searchTrimmed);
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
