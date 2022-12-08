var city;

$('#search-city').click(function() {
  $('html').addClass('wait')
  city = $('#city').val()
  $('#city').val('')

  setInterval(() => {
    // Use to remove cursor spinwheel once API fetch is complete
    $('html').removeClass('wait')
  }, 2000);
});

