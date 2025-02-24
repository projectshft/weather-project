import { extractYearMonthDateDay } from './helperFunctions.js';

function reduceForecastData(forecastData) {
  const { year, month, date } = extractYearMonthDateDay(
    // extract date time data from dt in data
    forecastData.list[0].dt
  );
  return filterForMidday(
    getNoonForTimezone(forecastData.city.timezone, year, month, date),
    forecastData.list
  );
}

function getNoonForTimezone(timezoneOffset, year, month, date) {
  // 12pm given date + 1 day in UTC, store in a date object
  const noonUtc = new Date(Date.UTC(year, month, date, 12, 0, 0));
  // change 12pm UTC to 12pm local using timezone offset from API
  // returned date is still in UTC
  noonUtc.setTime(noonUtc.getTime() - timezoneOffset * 1000);
  return noonUtc;
}

function filterForMidday(dateObject, dataArray) {
  const midday = Math.floor(dateObject.getTime() / 1000);
  // filter for closest timestamp to midday
  const closestIndex = getIndexClosestToMidday();
  // remove forecast items before midday
  const newArray = dataArray.slice(closestIndex);
  // return 5 days
  return newArray.filter((item, index) => {
    if (index % 8 === 0) {
      return item;
    }
  });

  function getIndexClosestToMidday() {
    return dataArray.reduce((closestIndex, current, index, array) => {
      if (
        Math.abs(current.dt - midday) <
        Math.abs(array[closestIndex].dt - midday)
      ) {
        closestIndex = index;
      }
      return closestIndex;
    }, 0);
  }
}

export { reduceForecastData };
