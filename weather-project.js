document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    if (city.trim() !== '') {
      fetchWeatherAndForecastData(city);
    }
  });
  
  function fetchWeatherAndForecastData(city) {
    const apiKey = '4d2230e28dd5ff342317c6687cd2d078';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
  
    // Fetch current weather data and forecast data simultaneously
    Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
      .then(responses => {
        return Promise.all(responses.map(response => response.json()));
      })
      .then(data => {
        const weatherData = data[0];
        const forecastData = data[1];
  
        // Check if both weather and forecast data are available
        if (weatherData.cod === '404' && forecastData.cod === '404') {
          throw new Error('City not found');
        }
  
        // Display weather data if available
        if (weatherData.cod !== '404') {
          displayWeatherData(weatherData);
        } else {
          throw new Error('Weather data not found');
        }
  
        // Display forecast data if available
        if (forecastData.cod !== '404') {
          displayForecastData(forecastData);
        } else {
          throw new Error('Forecast data not found');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
  }
  
  function displayWeatherData(data) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    if (data.main && data.main.temp && data.weather && data.weather[0] && data.weather[0].main) {
      weatherInfoDiv.innerHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Conditions: ${data.weather[0].main}</p>
      `;
    } else {
      weatherInfoDiv.innerHTML = '<p>Weather data not available</p>';
    }
  }
  
  function displayForecastData(data) {
    const forecastDiv = document.getElementById('forecast');

    
    // Check if data and data.list exist
    if (data && data.list) {
      // Loop through the forecast data and display each day's info
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        // Check if forecast and its properties exist
        if (forecast && forecast.main && forecast.main.temp && forecast.weather && forecast.weather[0] && forecast.weather[0].main) {
          const date = new Date(forecast.dt * 1000); // Convert timestamp to milliseconds
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
          const temp = forecast.main.temp;
          const conditions = forecast.weather[0].main;
          
          // Create HTML for forecast
          const forecastCard = `
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${dayOfWeek}</h5>
                <p class="card-text">Temperature: ${temp} °F</p>
                <p class="card-text">Conditions: ${conditions}</p>
              </div>
            </div>
          `;
          
          forecastDiv.innerHTML += forecastCard;
        } else {
          forecastDiv.innerHTML += '<p>Forecast data not available</p>';
        }
      }
    } else {
      forecastDiv.innerHTML = '<p>Forecast data not available</p>';
    }
  }


  console.log('Weather API Response:', fetchWeatherAndForecastData.weatherUrl);
  console.log('Forecast API Response:', fetchWeatherAndForecastData.forecastUrl);




// document.getElementById('searchBtn').addEventListener('click', function() {
//     const city = document.getElementById('cityInput').value;
//     if (city.trim() !== '') {
//       fetchWeatherData(city);
//     }
//   });
  
//   function fetchWeatherData(city) {
//     const apiKey = '4d2230e28dd5ff342317c6687cd2d078';
//     const url = `api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={4d2230e28dd5ff342317c6687cd2d078}`;
  
//     fetch(url)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('City not found');
//         }
//         return response.json();
//       })
//       .then(data => {
//         displayWeatherData(data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         alert('City not found');
//       });
//   }
  
//   function displayWeatherData(data) {
//     const weatherInfoDiv = document.getElementById('weatherInfo');
//     weatherInfoDiv.innerHTML = `
//       <h2>Current Weather</h2>
//       <p>Temperature: ${data.main.temp} °F</p>
//       <p>Conditions: ${data.weather[0].main}</p>
//     `;
//   }



// <!doctype html>
// <html lang="en">
//   <head>
//     <!-- Required meta tags -->
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

//     <!-- Bootstrap CSS -->
//     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

//     <title>Hello, world!</title>
//   </head>
//   <body>
//     <h1>Hello, Peyton!</h1>

//     <div class="container">
//         <p>Hello Peyton!</p>
//       </div>
//     <!-- Optional JavaScript -->
//     <!-- jQuery first, then Popper.js, then Bootstrap JS -->
//     <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
//     <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
//     <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
//   </body>
// </html>