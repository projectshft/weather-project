const weather = {
  apiKey: "2ef3e190072ad426d08c8e29c5e84340",
  fetchCurrentWeather(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=imperial`
    )
      .then((response) => response.json())
      .then((data) => {
        this.renderCurrent(data);
      });
  },
  fetchForecastWeather(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=imperial`
    )
      .then((response) => response.json())
      .then((data) => {
        this.renderForecastWeather(data);
        console.log(data)
      });
  },
  renderCurrent(data) {
    $(".current-weather").empty();
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp } = data.main;
    const source = $("#weather-template").html();
    const template = Handlebars.compile(source);
    const newHTML = template({
      temperature: temp,
      city: name,
      condition: description,
      iconURL: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    });
    $(".current-weather").append(newHTML);
  },
  renderForecastWeather(data) {
    $(".5-day").empty();
    for (let i = 0; i < 5; i++) {
      const { icon, description } = data.list[i*7].weather[0];
      const { temp } = data.list[i*7].main;
      const unix = data.list[i*7].dt;
      const milliseconds = unix * 1000; 
      const dateObject = new Date(milliseconds);
      const weekday = dateObject.toLocaleString("en-US", { weekday: "long" });
      const source = $("#future-forecast-template").html();
      const template = Handlebars.compile(source);
      const newHTML = template({
        condition: description,
        temperature: temp,
        iconURL: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        weekday: weekday,
      });
      $(".5-day").append(newHTML);
    }
  },
  search() {
    const query = $("#search-query").val();
    $("#search-query").val('')
    this.fetchCurrentWeather(query);
    this.fetchForecastWeather(query);
  },
};

$(".search-button").on("click", () => {
  weather.search();
});
