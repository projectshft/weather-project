//72e02d7e6f07aa32ae20388abf818118 API key

fetch('https://api.openweathermap.org/data/2.5/weather?q=Durham&APPID=72e02d7e6f07aa32ae20388abf818118')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
  });