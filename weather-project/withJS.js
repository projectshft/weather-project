// Get DOM elements
const key = '75e7ccabdef5725374998f0c3f3798b2';
const cityInput = document.getElementById('search-query'); //city
const submitBtn = document.querySelector('.search');
const displayWeather = document.querySelector('.search-results'); //results
const displayWeek = document.querySelector('.weekly-forecast'); //results
const setDefault = document.getElementById('default');

// Default City
// window.location.reload();
// setDefault.addEventListener('click', function(){
//   document.getElementById("cityInput").defaultValue = cityInput;
//   GetInfo();

  // document.getElementById("myText").defaultValue = "Goofy";

// })


// Icons object 
const weatherIcons = ["01d", "01n", "02d", "02n", "03d", "03n", "04d", "04n", "05d", "05n", "06d", "06n", "07d", "06n", "07d", "07n", "08d", "08n", "09d", "09n", "10d", "10n", "11d", "11n", "12d", "12n", "13d", "13n", "50d", "50n"]

const backgroundImages = ["slides-sunny.jpg", "slides-cloudy.jpg",
"slides-rainy.jpg", "slides-thunderstorm.jpg", "slides-snow.jpg", 
"slides-mist.jpg" ]


const background = {
  "01d": "slides"
  "01n":



}




// 'clear': 01n.png, 01.png,
// 'few clouds': 02d.png, 02n.png,
// 'scatterec clouds': 03d.png, 03n.png,
// 'broken clouds': 04d.png, 04n.png,
// 'shower rain': 09d.png, 09n.png,
// 'rain': 10d.png, 10n.png,
// 'thunderstorm': 11d.png, 11n.png,
// 'snow': 13d.png, 13n.png,
// 'mist': 50d.png, 50n.png

// <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">

document.body.style.backgroundImage = "url('slides-sunshine.jpg')";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "cover";

// Part 1: Function to fetch current weather details from API and display results:
const getCurrentWeather = function(){
  var cityValue = cityInput.value;
  console.log(`searching for city of ${cityValue}`)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {
// Change Background Image Weather
  if(data.weather[0].icon === '04n' || data.weather[0].icon === '04n'){
      document.body.style.backgroundImage = "url('slides-mist.jpg')";
      document.body.style.backgroundRepeat = "no-repeat";
      ddocument.body.style.backgroundSize = "cover";
  }
  else if (data.weather[0].icon === '10d' || data.weather[0].icon === '10n'){
    document.body.style.backgroundImage = "url('slides-rainy.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    ddocument.body.style.backgroundSize = "cover";
  }


      displayWeather.innerHTML = `
        <div className="weather-row">
          <div>
            <h2 className="weekly-temp">${data.main.temp.toFixed(0)}°</h2>
            <h4>${data.name}</h4>
          </div>
          <div>
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
      console.log('searching for 5 day forecast');
      // 1. temperature
      for(let i=0; i<5; i++){
        document.getElementById('temperature' +(i+1)).innerHTML 
        = `<h4>${data.list[i].main.temp.toFixed(0)}°</h4>`
      };
      // 2. weather icons
      for(let i=0; i<5; i++){
        document.getElementById('image' +(i+1)).src = 
        `http://openweathermap.org/img/wn/${ data.list[i].weather[0].icon}.png`
      }  
      // 3. weather conditions
      for(let i=0; i<5; i++){
        document.getElementById('weather' +(i+1)).innerHTML 
        = `<h6>${data.list[i].weather[0].main}</h6>` 
      };
  });
}

// Part 3: Days of the week
const d = new Date();
console.log(new Date());
const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function CheckDay(day){
  if(day + d.getDay() > 6){
    return day + d.getDay() - 7;
  }
  else{
    return day + d.getDay();
  }
}

for(i = 0; i<5; i++){
  document.getElementById("day" + (i+1)).innerHTML = weekday[CheckDay(i)];
}


submitBtn.addEventListener('click', getCurrentWeather);

 