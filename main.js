var fetch = function (query) {
  $.ajax({
    method: "GET",
    url:'http://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + query + '&appid=9b71dd7687d5daeb5225c83041aa3ed4',
    dataType: "json",
    success: function (data) {
      console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};


// var renderBooks = function () {
//   $('.books').empty();

//   for (var i = 0; i < books.length; i++) {
//     var source = $('#book-template').html();
//     var template = Handlebars.compile(source);
//     var newHTML = template(books[i]);
//     $('.books').append(newHTML);
//   };

$('.button').click(function() {
  var input = $('.input-box').val(); 
  fetch(input);
});