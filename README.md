## Weather Project

This project has been created by a student at Parsity, an online software engineering course. The work in this repository is wholly of the student based on a sample starter project that can be accessed by looking at the repository that this project forks.

If you have any questions about this project or the program in general, visit [parsity.io](https://parsity.io/) or email hello@parsity.io.

https://api.openweathermap.org/data/2.5/weather?q=London&appid=47660a38fec862070e43a3f0dfaed41c

var faces = [];

$('.search').on('click', function () {
  var sha = $('#search-query').val();

  fetch(sha);
});

var addFace = function(data) {
  faces.push({
    login: data.author.login,
    avatar_url: data.author.avatar_url
  });

  renderFaces();
};

var fetch = function (sha) {
  $.ajax({
    method: 'GET' ,
    url: 'https://api.github.com/repos/facebook/react/commits/' + sha,
    dataType: 'json',
    success: function (data) {
      addFace(data);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);

    }


  })
};

var renderFaces = function () {
  $('.faces').empty();
  
  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    
    var source = $('#face-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(face);

    $('.faces').append(newHTML);
  }
};

renderFaces();