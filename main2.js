const getCoords = function (search) {
  const url = 'http://api.openweathermap.org/geo/1.0/direct?q='+ search + '&limit=1&appid=cff7059d3ae892ee1e8de147ccce169f';
  fetch(url, {
    method: 'GET',
    datatype: 'json',
  })
    .then(data => data.json())
    .then(data => getDayWeather(data))
    .then(data => getWeekWeather(data));
};

const getDayWeather = function (data) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=cff7059d3ae892ee1e8de147ccce169f&units=imperial`
  fetch(url, {
    method: 'GET',
    datatype: 'json'
  })
    .then(data => data.json())
    .then(data => addDayWeather(data));
};

const getWeekWeather = function (data) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=cff7059d3ae892ee1e8de147ccce169f&units=imperial`
  fetch(url, {
    method: 'GET',
    datatype: 'json',
  })
    .then(data => data.json())
    .then(data => addWeekWeather(data));
};

const addDayWeather = function (data) {
  console.log(data);
};

const addWeekWeather = function (data) {
  console.log(data)
}