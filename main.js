//search for city in 'search' box
$('.search').on('click', function() {
  if ($('#input-search').val() != '') {
    fetchCurrent($('#input-search').val());
    fetchForecast($('#input-search').val());
  }

  //clear text from 'search' box
  $('#input-search').val('');
});

//allow user to click 'search' button upon clicking 'Enter'
$('#input-search').keyup(function(event) {
  if (event.keyCode == 13) {
    $('.search').click();
  };
});
