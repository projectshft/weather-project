// Creating an array for weather data
// Creating test template to verify data is shown in web page

let weatherDataFromAPI = [
    {
      temp: "72*",
      city: "Durham, NC",
      description: "Sunny",
      icon: "http://openweathermap.org/img/wn/01d@2x.png"}

];


// Creating render function to display weather array in web page

let renderWeather = () => {

// Empty weather array to append new data
  $('#weatherInfo').empty();


  let weatherData = weatherDataFromAPI[0];

  let source = $('#weather-template').html();
  let template = Handlebars.compile(source);
  let weatherDataHTML = template(weatherData);

  $('#weatherInfo').append(weatherDataHTML)

    console.log(weatherDataHTML)
};



// Listening for a click to submit form data
$('#searchCity').on('click', function () {

  console.log("OMG");
  renderWeather();

});
