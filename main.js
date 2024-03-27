const key = '9d545ab1acd07f6fe196233174125a11';


// Get user input
const searchField = document.getElementById('search-field');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {
  const searchValue = searchField.value;

  if(searchValue){
    
    // Clear the today text box
    while(todayText.hasChildNodes()) {
      todayText.removeChild(todayText.firstChild);
    }

    // Clear the today icon box
    while(todayIcon.hasChildNodes()) {
      todayIcon.removeChild(todayIcon.firstChild);
    }

    const getWeather = coordinates => {
      getToday(coordinates)
        .then(today => renderToday(today));

      getFiveDays(coordinates)
        .then(fiveDays => renderFiveDays(fiveDays));
    };

    getCoordinates(searchValue)
      .then(coordinates => {
        getWeather(coordinates);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    searchField.value = "";
  }
});

// Get the coordinates of a location
const getCoordinates = city => {

  const request = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`;
  
  return fetch(request)
      .then(response => response.json())
      .then(data => {
          const place = {
              city: data[0].name,
              latitude: data[0].lat,
              longitude: data[0].lon,
          }
          if (data[0].state) {
              place.state = data[0].state;
          }
          if (data[0].country) {
              place.country = data[0].country;
          }
          return place;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
      });
};

// Get the current weather for the provided coordinates
// https://openweathermap.org/current
const getToday = coordinates => {
    
  const lat = coordinates.latitude;
  const lon = coordinates.longitude;
  const request = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
  

  return fetch(request)
      .then(response => response.json())
      .then(data => data)
      .catch(error => {
          console.error("Error fetching data:", error);
      });
};

// Get the weather for the next five days
// https://openweathermap.org/forecast5
const getFiveDays = coordinates => {
    
  const lat = coordinates.latitude;
  const lon = coordinates.longitude;
  const request = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

  return fetch(request)
  .then(response => response.json())
  .then(data => data);
};

const getDayName = timestamp => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timestamp * 1000);
  const dayName = dayNames[date.getDay()];
  return dayName;
};

const translateDays = fiveDays => {
    const originalData = fiveDays.list;
    const days = [];

      for (i in originalData) {
        const day = getDayName(originalData[i].dt) // Day name of current snapshot
        const match = days.find(item => item.name === day); // Check if an object for this day exists.
        if (match) { // add it to to the Array
          match.list.push(originalData[i]) 
        } else { // Build on object and add it to the Array
          const dayObj = {
            name: day,
            list: [],
          };
          dayObj.list.push(originalData[i])
          days.push(dayObj);
        }
      }

    return days;
};

const getMaxTemps = data => {
  
  data.forEach(day => {
    // Build an array of all 'list.main.temp' values
    const temps = [];
    day.list.forEach(data => temps.push(data.main.temp));
    // Select the highest temp for that day
    day.temp = convertKelvin(Math.max(...temps));
  })
  
  return data;
};

const getConditions = data => {
  
  data.forEach(day => {
    // Make an array of conditions for each day
    const conditions = [];
    day.list.forEach(data => conditions.push(data.weather[0].main));
    
    // Cycle through the array and make an object that tracks each unique value
    const mode = conditions.reduce((acc,condition) => {
      !!acc[condition] ? acc[condition]++ : acc[condition] = 1;
      return acc;
    }, {})
    
    // Determine the condition that occurs the most
    day.condition = Object.keys(mode).reduce((a, b) => mode[a] > mode[b] ? a : b);
  
    // Find the matching icon for each winning condition
    const icon = day.list.find(data => day.condition === data.weather[0].main);
    day.icon = icon.weather[0].icon;
  })
  return data;
};

// Simply converts Kelvin to Fahrenheit and formats with a degree character
const convertKelvin = function(kelvin) {
  const fahrenheit = 1.8 * (kelvin - 273) + 32;
  const formatted = `${Math.round(fahrenheit)}°`;
  return formatted;
};

// Access today boxes and render values and icon
const todayText = document.getElementById('today-text');
const todayIcon = document.getElementById('today-icon');

const renderToday = today => {
  const tempElement = `<li>${convertKelvin(today.main.temp)}</li>`;
  const cityElement = `<li><h5>${today.name}</h5></li>`;
  const weatherElement = `<li>${today.weather[0].main}</li>`;
  const weatherIcon = `<img src="https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png" alt="${today.weather[0].main}"/>`;
  todayText.insertAdjacentHTML('beforeend',tempElement);
  todayText.insertAdjacentHTML('beforeend',cityElement);
  todayText.insertAdjacentHTML('beforeend',weatherElement);
  todayIcon.insertAdjacentHTML('beforeend',weatherIcon);
};

// Access the fivedays row
const fiveDaysElem = document.getElementById('fivedays');

const renderFiveDays = fiveDays => {  
  const today = getDayName(Date.now() / 1000);
  
  // Clear the five days element
  while(fiveDaysElem.hasChildNodes()) {
    fiveDaysElem.removeChild(fiveDays.firstChild);
  }
  
  // Translate the data to their respective day
  const withDayNames = translateDays(fiveDays);

  // Get the max temp for each day
  const withTemps = getMaxTemps(withDayNames);
  
  // Get the conditions for each day
  const withConditions = getConditions(withTemps);
  
  withConditions.forEach(day => {
    const dayWeatherElement = `<li>${day.condition}</li>`;
    const dayTempElement = `<li>${day.temp}</li>`;
    const dayIconElement = `<img src="https://openweathermap.org/img/wn/${day.icon}.png">`;
    const dayNameElement = `<li>${day.name}</li>`;
    const dayTemplate = 
      `<div class="col justify-content-center border border-dark">
        <div class="day d-flex align-items-center justify-content-center">
          <ul class="list-unstyled"">
            ${dayWeatherElement}
            ${dayTempElement}
            ${dayIconElement}
            ${dayNameElement}
          </ul>
        </div>
      </div>`;
    if (day.name !== today) {
      fiveDaysElem.insertAdjacentHTML("beforeend", dayTemplate);
    }
  });
};