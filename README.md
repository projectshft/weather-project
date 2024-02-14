## Weather Project

This project was created by Mutsumi Hata, a student at Parsity, an online software engineering program. The work in this repository is wholly of the student based on a sample starter project that can be accessed by looking at the repository that this project forks.

If you have any questions about this project or the program in general, visit [parsity.io](https://parsity.io/) or email hello@parsity.io.

## About

The Weather Project is a simple application that uses Open Weather's API to show the user a five-day weather forecast based on user input. Open Weather's geocoding API enables the user to input a city name and converts it to the city's exact goegraphical coordinates.

## API Key

In Main.js, the variable **apiKey** on line 24 has been left as an empty string. Please generate your own API key from Open Weather to use in this application. The **One Call API 3.0** should suffice.
[Open Weather API Free Subsription](https://openweathermap.org/api)

## Future Additions

1. Create a "set as default" button to set a default city. Upon refresh, default city should always render without a prompt.
2. Create button to look up current geolocation by entering city name.
3. Alter page style based on the current weather of the city (maybe a rainy background image for a forecast of rain, etc).
4. Render map with current location of city using Google Maps Embed API.
