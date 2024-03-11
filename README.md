# Weather App Readme

This Weather App allows users to view current weather and a five-day forecast for their location or a chosen city. It utilizes the OpenWeatherAPI for weather data and Google Maps API for geolocation. Users can also set a default city for quick access.

## Features

- **Current Weather**: Displays current weather conditions including temperature, description, and an icon representing the weather.
- **Five-Day Forecast**: Shows a forecast for the next five days, updating every three hours.
- **Geolocation**: Utilizes the browser's geolocation feature to get the user's current location.
- **City Search**: Allows users to search for weather conditions in any city.
- **Default City**: Users can set a default city for quick access to weather information.

## Usage

1. **Getting Started**: Open the app in a browser.
2. **Default City**: If a default city is set in local storage, the weather information for that city will be displayed upon page load.
3. **Geolocation**: Click the "Get Current Location" button to fetch weather information for your current location.
4. **Search for City**: Enter a city name in the search bar and click "Search" to fetch weather information for that city.
5. **Set Default City**: Click the "Add City as Default" button to set the current city as the default for quick access.

## Dependencies

- **OpenWeatherAPI**: Provides weather data for current conditions and forecasts.
- **Google Maps API**: Used for reverse geocoding to get city information from coordinates.

## Installation

No installation is required to use this web app. Simply open the HTML file in a web browser.
