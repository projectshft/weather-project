const getDailyForecast = (userInput) => {
  const dailyForecast = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${userInput}&cnt=6&units=imperial&APPID=488ccba088277352dc6babea1f438def`

  fetch(dailyForecast)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let weatherTemplate = template({
        //display high for the day in place of current weather
        name: data.city.name,
        temp: data.list[0].temp.day,
        description: data.list[0].weather[0].description,
        // add high of the days to each card
        day2: moment().add(1, 'd').format("dddd"),
        temp2: data.list[1].temp.day,
        description2: data.list[1].weather[0].description,

        day3: moment().add(2, 'd').format("dddd"),
        temp3: data.list[2].temp.day,
        description3: data.list[2].weather[0].description,

        day4: moment().add(3, 'd').format("dddd"),
        temp4: data.list[3].temp.day,
        description4: data.list[3].weather[0].description,

        day5: moment().add(4, 'd').format("dddd"),
        temp5: data.list[4].temp.day,
        description5: data.list[4].weather[0].description
      })
      $('.header').append(weatherTemplate);
    })
}

const getCurrentLocationWeather = (long, lat) => {
  const currentLocationWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&APPID=1d6f5ea050c2a30c3485c7944ca499e0`

  fetch(currentLocationWeather)
    .then(response => {
      return response.json();
    })
    .then(data => {
      $('.location-city-name').append(data.name);
      $('.temp-degree').prepend(data.main.temp);
      $('.temp-description').append('<strong>' + data.weather[0].description + '</strong>');
    })
}
