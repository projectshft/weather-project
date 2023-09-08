# Weather Project

This was an assessment I completed for [Parsity](https://www.parsity.io). The objective of the projective was to use the [OpenWeather API](https://openweathermap.org/) to create a frontend weather app that met the following requirements:

- Include a search bar at the top of the page for looking up a city's weather;
- After searching for a city, display the city's current temperature in Fahrenheit, the name of the city, the description of the current weather, and an icon representing the weather conditions;
- Display a 5-day forecast including the description of the weather for that day, temperature in Fahrenheit, weather conditions icon, and day of the week.

Afer meeting those basic requirements, I added these additional features:

- I created daytime and nighttime themes that display, respectively, depeneding on when the sun sets and rises in the location that is currently being on screen;
- In the current weather section, I added "High Today", "Low Today", "Local Time" at moment of search, and "Sunrise" and "Sunset" times;
- I added a button that allows for toggling between Fahrenheit and Celsius;
- I utilized the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to allow for the initial display to be the weather forecast in the user's current location;
- I added the option to "Set as Default", which sets whatever city the user is currently looking at to be their default city when they return to the site;
- Finally, I used the Google [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) to render a map centered on the city that is in view.

## How to Use

Click [here](https://jordanccox.github.io/weather-project/) to test out the project.

- When the browser asks to know your location, allow it. Your current city should be displayed along with its weather conditions and forecast.
- Search for a city by typing the city name ("San Diego") or by typing the city, state (if applicable), and two-letter country [ISO code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) ("Fort Collins, Colorado, US").
- To toggle temperature units, click the button reading "Celsius" at the top of the page. All the temperatures will be converted to Celsius and the button will read "Fahrenheit." To toggle back to Fahrenheit, press the button again.
- To set a default location other than your current one, search for the city that you want to be your default city and click Options > Set as Default. When you refresh the page, this city will be the first one that comes up.
- To remove the default location, click Options > Remove Default.
