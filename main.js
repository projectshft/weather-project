const fetch = $.ajax({
  method: 'GET',
  url: `https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=4da99895dae25ae39743d1996fb14942`,
  dataType: 'json',
  success(data) {
    console.log(data);
  },
  error(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
  },
});

$('.search').on('click', () => {
  const search = $('#search-query').val();

  fetch(search);

  $('#search-query').val('');
});

$('input').on('keypress', (e) => {
  const keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode === 13) {
    e.preventDefault();
    const search = $('#search-query').val();

    fetch(search);

    $('#search-query').val('');
  }
});
