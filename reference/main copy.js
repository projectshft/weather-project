var weatherForecast = [];

var addWeatherday = function (data) {
  var contributor = { 
    img: data.author.avatar_url,
    login: data.author.login
  }
  weatherForecast.push(contributor);
}

var renderWeather = function () {
  $('#commits').empty();
  for (var i = 0; i < weatherForecast.length; i++){
    var source = $('#contributor-template').html();
    var template = Handlebars.compile(source);
    var contributorHTML = template(weatherForecast[i]);
    $('.commits').append(contributorHTML);
  }



}

var fetchWeather = function (sha) {
  $.ajax({
    method: "GET",
    url: "https://api.github.com/repos/facebook/react/commits/" + sha,
    dataType: "json",
    success: function(data) {
      addWeatherday(data);
      console.log(data);
      renderWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
  
 
$('#search').on('click', function (){
  console.log('click');
  var sha = $('#sha').val();
  console.log(sha);
  fetchWeather(sha);
});


renderWeather();