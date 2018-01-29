$('.search').on('click', function() {
  fetchCurrent($('#input-search').val());
  fetchForecast($('#input-search').val());

  $('#input-search').val('');
});

$('#input-search').keyup(function(event) {
  if (event.keyCode == 13) {
    $('.search').click();
  };
});
