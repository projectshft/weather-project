// Weather API Project

// add click event and grab value of input
$('#search').on('click', function() {
  var search = $('#search').val();
  console.log('click');

  fetchData(search);
});
