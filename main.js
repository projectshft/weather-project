var weatherData = [];


$('#search-button').on('click', function() {
  var searchQuery = $('#search-query').val();
  fetch(searchQuery);
})
