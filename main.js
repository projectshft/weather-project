var fetch = function(query) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=16e8800e45b79f25abb73f07cc2f92ce`,
    dataType: "json",
    success: function(data) {
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

$('button').on('click', function() {
  var $city = $('#city-input').val()
  fetch($city);

})
