// When a user clicks the search button, grab their input.

document.querySelector('.search').addEventListener('click', function () {
  var search = document.getElementById('text').value;
  
  fetchWeather(search);
  fetch5DayWeather(search);

});
// // Use their input to make a GET request from the web app API.


var fetchWeather = function (query) {
  const apiKey = '281a2c6bad4d09515b929ae2c5dc15be';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => addWeather(data));
}

// Take the data from the web app API and put it inside the weatherToday array.

var addWeather = function (data) {
  weatherPosts = [];
  
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  console.log(iconUrl);
  const fDegrees = Math.round((data.main.temp - 273.15) * 9/5 + 32);
  
  var weather = {
    temp: fDegrees, 
    city: data.name,
    condition: data.weather[0].main,
    icon: iconUrl

  };
    weatherPosts.push(weather);
    renderWeather(weatherPosts);

  };
  
  
  renderWeather = function (weatherPosts) {
  document.querySelector('.posts').replaceChildren();
  
  
  for (let  i = 0;  i < weatherPosts.length;  i++) {
    const weatherData = weatherPosts[i];
  
    const template = `
    <img class = "img" src="${weatherData.icon}" alt="Weather Icon"></img>
    <div class="weather col-md-2">
      <div><strong>${weatherData.temp}&deg</strong></div>
        <h4>${weatherData.city}</h4>
        <div><strong>${weatherData.condition}</strong></div>
      </div>`;
  
    // Use our template and append to .posts
    document.querySelector('.posts').insertAdjacentHTML('beforeend', template);
  
  }
};
//

var fetch5DayWeather = function (query) {
  const apiKey = '281a2c6bad4d09515b929ae2c5dc15be';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(response => response.json())  // Corrected from data to response
  .then(data => add5DayWeather(data));
}

var add5DayWeather = function (data) {
  
  console.log(data);
  weather5DayPosts = [];
  fivePosts = [];
  
  for (let i = 0; i < data.list.length; i++) {  // Iterate through the list array
    const iconUrl = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
    const fDegrees = Math.round((data.list[i].main.temp - 273.15) * 9/5 + 32);
    
    var fiveDayWeather = {
      condition: data.list[i].weather[0].main,
      temp: fDegrees, 
      city: data.city.name,
      icon: iconUrl,
      day: data.list[i].dt_txt
    };

    weather5DayPosts.push(fiveDayWeather);
  }
  //populate fivePosts with every 7th element from weather5DayPosts
    for (let i = 0; i < weather5DayPosts.length; i+=8) {
      const post = weather5DayPosts[i];
      fivePosts.push(post);
  }
  
  render5DayWeather(fivePosts);
}
      
render5DayWeather = function (weather5DayPosts) {
  document.querySelector('.fiveday').replaceChildren();
  
  for (let i = 0; i < weather5DayPosts.length; i++) {
    const weather5DayData = weather5DayPosts[i];

    const template = `
      <div class= "5day col-md-2">
        <div>${weather5DayData.condition}</div>
        <div><strong>${weather5DayData.temp} &deg;</strong></div>
        <div><img class="img" src="${weather5DayData.icon}" alt="Weather Icon"></img></div>
        <div><strong>${weather5DayData.day}</strong></div>
      </div>`;

    // Use our template and append to .posts
    document.querySelector('.fiveday').insertAdjacentHTML('beforeend', template);
  }
};

      




 







  
 
