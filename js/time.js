export const getLocalTime = (weather, date) => {
  let currentUTCTime = new Date();
  
  if (date) {
    currentUTCTime = date;
  } 

  const currentUTCHours = currentUTCTime.getUTCHours();
  let currentUTCMinutes = currentUTCTime.getUTCMinutes();
  let localTimeHours = (weather.timezone / 60 /60) + currentUTCHours;

  if (localTimeHours < 0) {
    localTimeHours += 24;
  }

  if (localTimeHours >= 24) {
    localTimeHours -= 24;
  }

  if (localTimeHours >= 0 && localTimeHours < 10) {
    localTimeHours = 0 + "" + localTimeHours;
  }

  if (currentUTCMinutes < 10) {
    currentUTCMinutes = 0 + "" + currentUTCMinutes;
  }
  
  const localTime = `${localTimeHours}:${currentUTCMinutes}`;
  
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

export const getLocalTimeTest = (weather, date) => {
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

  console.log(localTimeHours + " " + localTimeMinutes);

  if (localTimeHours >= 0 && localTimeHours < 10) {
    localTimeHours = 0 + "" + localTimeHours;
  }

  if (localTimeMinutes < 10) {
    localTimeMinutes = 0 + "" + localTimeMinutes;
  }
  
  const localTime = `${localTimeHours}:${localTimeMinutes}`;
  
  return localTime;
};