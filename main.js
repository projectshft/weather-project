$('.search').on('click', function () {
  var search = $('#search-query').val();
  getWeatherData(search);
});

var getWeatherData = () => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${}&APPID=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      console.log(data) // Prints result from `response.json()` in getRequest
    })
    .catch(error => console.error(error))
}

const API_KEY = '4f479c5fa18add48ba9381407334d58b';