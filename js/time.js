
// Returns local time in format hh:mm
// @param {object} weather Weather object which contains the timezone offset from UTC
// @param {Date} date (optional) Date to set current UTC time to (used when setting sunrise and sunset times)
// @return {string} localTime Local time in format hh:mm

export const getLocalTime = (weather, date) => {
  let currentUTCTime = new Date();
  
  if (date) {
    currentUTCTime = date;
  } 

  const currentUTCHours = currentUTCTime.getUTCHours();
  let currentUTCMinutes = currentUTCTime.getUTCMinutes();
  let localTimeMinutes = (weather.timezone / 60) + currentUTCMinutes;
  let localTimeHours = currentUTCHours;

  if (localTimeMinutes < 0) {
    localTimeMinutes += 1440;
  }

  if (localTimeMinutes >= 1440) {
    localTimeMinutes -= 1440;
  }

  while (localTimeMinutes >= 60) {
    localTimeMinutes -= 60;
    localTimeHours++;
  }

  if (localTimeHours < 0) {
    localTimeHours += 24;
  }

  if (localTimeHours >= 24) {
    localTimeHours -= 24;
  }

  if (localTimeHours >= 0 && localTimeHours < 10) {
    localTimeHours = 0 + "" + localTimeHours;
  }

  if (localTimeMinutes < 10) {
    localTimeMinutes = 0 + "" + localTimeMinutes;
  }
  
  const localTime = `${localTimeHours}:${localTimeMinutes}`;
  
  return localTime;
};

export const getSunriseTime = (weather) => {
  const sunriseTimeUTC = new Date(weather.sunrise * 1000);
  const localSunriseTime = getLocalTime(weather, sunriseTimeUTC);
  return localSunriseTime;
};

export const getSunsetTime = (weather) => {
  const sunsetTimeUTC = new Date(weather.sunset * 1000);
  const localSunsetTime = getLocalTime(weather, sunsetTimeUTC);
  return localSunsetTime;
};

// Returns boolean indicating if local time is daytime or nighttime
// @param {object} weather Object with timezone offset from UTC
// @return {boolean} day Returns true if local time is after local sunrise / before local sunset and returns false otherwise

export const compareTime = (weather) => {
  const utcTime = new Date();
  const localTime = Date.parse(utcTime) + weather.timezone;
  const sunriseTimeUTC = new Date(weather.sunrise * 1000);
  const localSunrise = Date.parse(sunriseTimeUTC) + weather.timezone;
  const sunsetTimeUTC = new Date(weather.sunset * 1000);
  const localSunset = Date.parse(sunsetTimeUTC) + weather.timezone;
  let day = false;

  if (localTime >= localSunrise && localTime <= localSunset) {
    day = true;
    return day;
  }

  return day;
};  

