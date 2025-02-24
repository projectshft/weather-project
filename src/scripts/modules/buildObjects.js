import { extractYearMonthDateDay, toTitleCase } from './helperFunctions.js';
import { daysOfWeek, monthsOfYear } from '../variables/dtStrings.js';

function buildWxObject(data) {
  const { weather, main, name } = data.weather;
  return {
    icon: weather[0].icon,
    cityName: name,
    description: toTitleCase(weather[0].description),
    temperature: main.temp,
  };
}

function buildFxObject(data) {
  const output = data.forecast.reduce((struct, current) => {
    const { _, month, day, date } = extractYearMonthDateDay(current.dt);

    const dateString = `${daysOfWeek[day]}, ${monthsOfYear[month]} ${date}`;
    struct.push({
      icon: current.weather[0].icon,
      dateString: dateString,
      description: toTitleCase(current.weather[0].description),
      temperature: current.main.temp,
    });
    return struct;
  }, []);
  return { forecast: output };
}

export { buildWxObject, buildFxObject };
