// Get DOM elements
const key = '75e7ccabdef5725374998f0c3f3798b2';
const cityInput = document.getElementById('search-query'); 
const submitBtn = document.querySelector('.search');
const displayWeather = document.querySelector('.search-results'); 
const displayWeek = document.querySelector('.weekly-forecast'); 
const setDefault = document.getElementById('default');

// Default City
// window.location.reload();
setDefault.addEventListener('click', function(){
  console.log('Set as default city')
  document.getElementById("cityInput").defaultValue = cityInput;
  document.getElementById("myText").defaultValue = `${cityInput}`;
})

// Part 1: Function to fetch current weather details from API and display results:
const getCurrentWeather = function(){
  var cityValue = cityInput.value;
  console.log(`searching for city of ${cityValue}`)

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {

    // Switch statements to change background images
    const backgroundImage = data.weather[0].icon;
    console.log('Weather icon code = ' + backgroundImage);

    switch(backgroundImage){
      case "01d": 
        document.body.style.backgroundImage = "url('images/clear.jpg')";
        break;
      case "01n": 
        document.body.style.backgroundImage = "url('images/clear.jpg')";
        break;
      case "02d":
        document.body.style.backgroundImage = "url('images/few-clouds.jpg')";
        break;
      case "02n":
        document.body.style.backgroundImage = "url('images/few-clouds.jpg')";
        break;
      case "03d": 
        document.body.style.backgroundImage = "url('images/scattered-clouds.jpg')";
        break;
      case "03n": 
        document.body.style.backgroundImage = "url('images/scattered-clouds.jpg')";
      case "04d":
        document.body.style.backgroundImage = "url('images/overcast.jpg')";
        break;
      case "04n": 
        document.body.style.backgroundImage = "url('images/overcast.jpg')";
        break;
      case "09d":
        document.body.style.backgroundImage = "url('images/rainy.jpg')";
        break;
      case "09n": 
        document.body.style.backgroundImage = "url('images/rainy.jpg')";
        break;
      case "10d":
        document.body.style.backgroundImage = "url('images/rainy.jpg')";
        break;
      case "10n":
        document.body.style.backgroundImage = "url('images/rainy.jpg')";
        break;
      case "11d":
        document.body.style.backgroundImage = "url('images/thunderstorm.jpg')";
        break;
      case "11n":
        document.body.style.backgroundImage = "url('images/thunderstorm.jpg')";
        break;
      case "13d":
        document.body.style.backgroundImage = "url('images/snow.jpg')";
        break;
      case "13n":
        document.body.style.backgroundImage = "url('images/snow.jpg')";
        break;
      case "50d":
        document.body.style.backgroundImage = "url('images/foggy.jpg')";
        break;
      case "50n":
        document.body.style.backgroundImage = "url('images/foggy.jpg')";
        break;
    }
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";  

  displayWeather.innerHTML = `
    <div className="weather-row">
      <div className="left-side">
        <h2 className="weekly-temp">${data.main.temp.toFixed(0)}°</h2>
        <h4>${data.name}</h4>
      </div>
      <div className="right-side">
        <h5>${data.weather[0].description}</h5>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" height=95px width=95px>
      </div>
    </div>
  `
  })

// Part 2: Function to fetch 5 day weather details from API and display results:
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${key}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      // console.log('searching for 5 day forecast');
      for(let i=0; i<5; i++){
        document.getElementById('temperature' +(i+1)).innerHTML 
        = `<h4>${data.list[i].main.temp.toFixed(0)}°</h4>`
        document.getElementById('image' +(i+1)).src = 
        `http://openweathermap.org/img/wn/${ data.list[i].weather[0].icon}.png`
        document.getElementById('weather' +(i+1)).innerHTML 
        = `<h6>${data.list[i].weather[0].main}</h6>` 
      };
  
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      const today = new Date();

      day1.innerHTML = weekdays[today.getDay() + 1];
      day2.innerHTML = weekdays[today.getDay() + 2];
      day3.innerHTML = weekdays[today.getDay() + 3];
      day4.innerHTML = weekdays[today.getDay() + 4];
      day5.innerHTML = weekdays[today.getDay() + 5];

    });
  }

submitBtn.addEventListener('click', getCurrentWeather);

