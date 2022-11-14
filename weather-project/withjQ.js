// Get DOM elements
const key = '75e7ccabdef5725374998f0c3f3798b2';
// const cityInput = document.getElementById('search-query'); //city
// const submitBtn = document.querySelector('.search');
const showResults = document.querySelector('.search-results'); //results



// Function to fetch weather details from API and display results:
$('.search').on('click', function () {
  var cityValue = $('#search-query').val();
  console.log(`Searching for city: ${cityValue}`);
  fetch(cityValue);
});




// const getWeather = function(){
//   var cityValue = cityInput.value;
//   console.log(`searching for city of ${cityValue}`)

//   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=imperial`)
//     .then((response) => response.json())
//     // If city name is valid
//     .then((data) => {

//     // Display results

//       var weatherData = {
//         temperature : data.main.temp,
//         city: data.name,
//         weather: data.weather[0].description
//       }


//   // Handling the Data
//   var source = document.getElementById('weather-template').innerHTML;
//   var template = Handlebars.compile(source);
//   var container = document.querySelector('.current-weather-container');


//       // with jQuery
//       // var source = document.getElementById('weather-template').innerHTML;
//       // var template = Handlebars.compile(source);
//       // var weatherData = {
//       //   temperature : data.main.temp,
//       //   city: data.name,
//       //   weather: data.weather[0].description
//       // }

//       var newHTML = template(weatherData);
//       document.querySelector('.current-weather-container').innerHTML = newHTML;

//       console.log(data);
//       console.log(`Temperature is: ${data.main.temp} Fahrenheit`);
//       console.log(`City is: ${data.name}`);
//       console.log(`Weather today is: ${data.weather[0].description}`);
//       console.log(`Icon: ${data.weather[0].main}`);
//       console.log(`Icon: ${data.weather[0].icon}`);

//     })
//   };

// submitBtn.addEventListener('click', getWeather);

 