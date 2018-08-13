# weather-project
This project uses the OpenWeather API for weather information, and the Google Maps API to find the state
from lat/lon since OpenWeather does not provide it.

Notes:
After adding "default location" and "find my location" functions, I had to make them both rely 100% on coordinates.
But they work together now!  Find your location, set it as default, then refresh and viola!

Currently only accepts a city name as input, state cannot be specified.  Use a ZIP if you get the wrong state.

Hardcoded to US only.  OpenWeather provides a city code lookup table which could be used for international cities.

Hardcoded to imperial units.  This could be toggled to metric.

The weather forecast is for ~-18-21hrs from the time of the request, then every 24hrs -- not the day's high.
This could be updated to add a lo/hi feature, calculated from all the forecasts.  

Sometimes the Google Maps city/state lookup adds a ZIP which is a bit ugly.  That's an inconsistency with Google's pre-formatted data, could be fixed by manually parsing out the city and state only.

The background changes color based on the weather icon -- grey for cloudy or rainy, yellow for clear daytime, and dark
grey for clear nighttime.  
