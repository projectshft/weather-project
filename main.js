document.querySelector("#search-btn").addEventListener("click", () => {
  const searchInput = document.querySelector(".search-input").value;
  fetchData(searchInput);
  fetchFiveDay(searchInput);
  document.querySelector(".search-input").value = "";
});

async function fetchData(searchInput) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&APPID=a4396d434551ba845da6a657caa7cd7c&units=imperial`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        alert("Error 404. Please enter a valid city name.");
      } else {
        alert(`Error: ${response.status}.`);
      }
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    const city = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].main;
    const imageIconNumber = data.weather[0].icon;
    const imageUrl = `https://openweathermap.org/img/wn/${imageIconNumber}@2x.png`;

    updateWeather(city, temperature, description, imageUrl);
  } catch (error) {
    console.log("Error", error);
  }
}
const updateWeather = (city, temperature, description, imageUrl) => {
  const tempInfo = document.querySelector(".temp-info");
  const tempRounded = Math.round(temperature);

  tempInfo.innerHTML = "";

  const template = `       
    <div class="container mt-4">
      <div class="row">
        <div class="card-group">
          <div class="card current-weather text-center">
            <div class="card-body temp-info">
              <h1 class="card-title current-temp">${tempRounded}°F</h1>
              <h4 class="card-title current-city">${city}</h4>
              <p class="card-text current-vis"><small>${description}</small></p>
            </div>
        </div>
            <div class="card current-weather text-left">
            <div class="card-body text-left">
              <img src=${imageUrl} alt="weather icon" />
            </div>
          </div>
        </div>
      </div>
    </div>`;

  tempInfo.insertAdjacentHTML("beforeend", template);
};

async function fetchFiveDay(searchInput) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=a4396d434551ba845da6a657caa7cd7c&units=imperial`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        alert("Error 404. Please enter a valid city name.");
      } else {
        alert(`Error: ${response.status}.`);
      }
      throw new Error(`Response status: ${response.status}`);
    }
    const dataFiveDay = await response.json();

    const list = dataFiveDay.list;

    const dayOne = list[7];
    const dayTwo = list[15];
    const dayThree = list[22];
    const dayFour = list[29];
    const dayFive = list[36];

    const dayOneTemp = dayOne.main.temp;

    const dayOneDescription = dayOne.weather[0].description;
    const dayOneImageIconNumber = dayOne.weather[0].icon;
    const dayOneImageUrl = `https://openweathermap.org/img/wn/${dayOneImageIconNumber}@2x.png`;

    const dayTwoTemp = dayTwo.main.temp;
    const dayTwoDescription = dayTwo.weather[0].description;
    const dayTwoImageIconNumber = dayTwo.weather[0].icon;
    const dayTwoImageUrl = `https://openweathermap.org/img/wn/${dayTwoImageIconNumber}@2x.png`;

    const dayThreeTemp = dayThree.main.temp;
    const dayThreeDescription = dayThree.weather[0].description;
    const dayThreeImageIconNumber = dayThree.weather[0].icon;
    const dayThreeImageUrl = `https://openweathermap.org/img/wn/${dayThreeImageIconNumber}@2x.png`;

    const dayFourTemp = dayFour.main.temp;
    const dayFourDescription = dayFour.weather[0].description;
    const dayFourImageIconNumber = dayFour.weather[0].icon;
    const dayFourImageUrl = `https://openweathermap.org/img/wn/${dayFourImageIconNumber}@2x.png`;

    const dayFiveTemp = dayFive.main.temp;
    const dayFiveDescription = dayFive.weather[0].description;
    const dayFiveImageIconNumber = dayFive.weather[0].icon;
    const dayFiveImageUrl = `https://openweathermap.org/img/wn/${dayFiveImageIconNumber}@2x.png`;

    updateWeatherTwo(
      dayOneTemp,
      dayOneDescription,
      dayOneImageUrl,
      dayTwoTemp,
      dayTwoDescription,
      dayTwoImageUrl,
      dayThreeTemp,
      dayThreeDescription,
      dayThreeImageUrl,
      dayFourTemp,
      dayFourDescription,
      dayFourImageUrl,
      dayFiveTemp,
      dayFiveDescription,
      dayFiveImageUrl
    );
  } catch (error) {
    console.log("Error");
  }
}

const updateWeatherTwo = (
  dayOneTemp,
  dayOneDescription,
  dayOneImageUrl,
  dayTwoTemp,
  dayTwoDescription,
  dayTwoImageUrl,
  dayThreeTemp,
  dayThreeDescription,
  dayThreeImageUrl,
  dayFourTemp,
  dayFourDescription,
  dayFourImageUrl,
  dayFiveTemp,
  dayFiveDescription,
  dayFiveImageUrl
) => {
  const fiveDay = document.querySelector(".five-day");

  const dayOneTempRound = Math.round(dayOneTemp);
  const dayTwoTempRound = Math.round(dayTwoTemp);
  const dayThreeTempRound = Math.round(dayThreeTemp);
  const dayFourTempRound = Math.round(dayFourTemp);
  const dayFiveTempRound = Math.round(dayFiveTemp);

  fiveDay.innerHTML = "";

  const date = new Date();
  const day = date.getDay();

  let dayOne;
  let dayTwo;
  let dayThree;
  let dayFour;
  let dayFive;

  if (day === 0) {
    dayOne = "Sunday";
    dayTwo = "Monday";
    dayThree = "Tuesday";
    dayFour = "Wednesday";
    dayFive = "Thursday";
  } else if (day === 1) {
    dayOne = "Monday";
    dayTwo = "Tuesday";
    dayThree = "Wednesday";
    dayFour = "Thursday";
    dayFive = "Friday";
  } else if (day === 2) {
    dayOne = "Tuesday";
    dayTwo = "Wednesday";
    dayThree = "Thursday";
    dayFour = "Friday";
    dayFive = "Saturday";
  } else if (day === 3) {
    dayOne = "Wednesday";
    dayTwo = "Thursday";
    dayThree = "Friday";
    dayFour = "Saturday";
    dayFive = "Sunday";
  } else if (day === 4) {
    dayOne = "Thursday";
    dayTwo = "Friday";
    dayThree = "Saturday";
    dayFour = "Sunday";
    dayFive = "Monday";
  } else if (day === 5) {
    dayOne = "Friday";
    dayTwo = "Saturday";
    dayThree = "Sunday";
    dayFour = "Monday";
    dayFive = "Tuesday";
  } else if (day === 6) {
    dayOne = "Saturday";
    dayTwo = "Sunday";
    dayThree = "Monday";
    dayFour = "Tuesday";
    dayFive = "Wednesday";
  } else {
    console.log("Invalid day. Please enter a number between 0 and 6.");
  }

  const template = `<div class="container-fluid mt-4 ">
      <div class="row g-3">
      <div class="col">
        <!--Column 1 -->
        <div class="list-group-item list-group-flush text-center">
          <h5 class="text-center">${dayOneDescription}</h5>
          <p class="mb-1">${dayOneTempRound}°F</p>
          <p class="mb-1">
            <img src=${dayOneImageUrl} />
          </p>
          <small id="day">${dayOne}</small>
        </div>
      </div>
      <div class="col">
        <!--Column 1 -->
        <div class="list-group-item list-group-flush text-center">
          <h5 class="text-center">${dayTwoDescription}</h5>
          <p class="mb-1">${dayTwoTempRound}°F</p>
          <p class="mb-1">
            <img src=${dayTwoImageUrl} />
          </p>
          <small id="day">${dayTwo}</small>
        </div>
      </div>
            <div class="col">
        <!--Column 1 -->
        <div class="list-group-item list-group-flush text-center">
          <h5 class="text-center">${dayThreeDescription}</h5>
          <p class="mb-1">${dayThreeTempRound}°F</p>
          <p class="mb-1">
            <img src=${dayThreeImageUrl} />
          </p>
          <small id="day">${dayThree}</small>
        </div>
      </div>
            <div class="col">
        <!--Column 1 -->
        <div class="list-group-item list-group-flush text-center">
          <h5 class="text-center">${dayFourDescription}</h5>
          <p class="mb-1">${dayFourTempRound}°F</p>
          <p class="mb-1">
            <img src=${dayFourImageUrl} />
          </p>
          <small id="day">${dayFour}</small>
        </div>
      </div>
            <div class="col">
        <!--Column 1 -->
        <div class="list-group-item list-group-flush text-center">
          <h5 class="text-center">${dayFiveDescription}</h5>
          <p class="mb-1">${dayFiveTempRound}°F</p>
          <p class="mb-1">
            <img src=${dayFiveImageUrl} />
          </p>
          <small id="day">${dayFive}</small>
        </div>
      </div>
    </div>
  </div>`;
  fiveDay.insertAdjacentHTML("beforeend", template);
};
