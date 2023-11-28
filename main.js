const key = '5dbc25bc8e1707e2fd6040f71c4df0dd'
let city;

const showWeather = (data) => {
  temp = Math.floor(data.main.temp * 1.8 - 459.67)
  desc = data.weather[0].main
  const template = `

  <div class="weather-container d-flex">
    <div class="weather-words text-center">
      <h3 class="temp">${temp}&deg;</h3>
      <h2 class="city">${city}</h2>
      <p class="weather-desc">${desc}</p>
    </div>
    <div class="icon">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
    </div>
  </div>

  `

  document.querySelector('.weather-now').insertAdjacentHTML('beforeend', template)
} 

const getWeather = (data) => {
  let lat = data[0].lat
  let lon = data[0].lon
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`

  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showWeather(data))
}

const getLatLong = (city) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => getWeather(data))
}

document.querySelector('.search').addEventListener('click', () => {
  document.querySelector('.weather-now').replaceChildren()
  let q = document.querySelector('#city').value
  city = q;
  getLatLong(q)
  document.querySelecton('#city')
})