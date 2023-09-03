export const getLocalTime = (weather) => {
  const currentUTCTime = new Date();
  const currentUTCHours = currentUTCTime.getUTCHours();
  const currentUTCMinutes = currentUTCTime.getUTCMinutes();
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
  
  const localTime = `${localTimeHours}:${currentUTCMinutes}`;
  
  return localTime;
};