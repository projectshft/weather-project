Intro =========================================================================

Today you will be unleashed to figure out how to use an API all on your own.
You'll be using http://openweathermap.org/ to build a simple weather application.
It will be your job to read through the API documentation and figure everything out.
But to get you started, here are a couple of links you'll need:


  _X_  Get and use an API Key: http://openweathermap.org/appid
        using 0f9391bf663647fd9cad13780bf4eff1

  __  Current Weather Data: http://openweathermap.org/current
          Durham, NC test: http://api.openweathermap.org/data/2.5/weather?q=Durham&appid=0f9391bf663647fd9cad13780bf4eff1

  __  5 Day Forecast Data: http://openweathermap.org/forecast5
          Duham, NC test: http://api.openweathermap.org/data/2.5/forecast?q=Durham&appid=0f9391bf663647fd9cad13780bf4eff1

  __  Weather Conditions and Icons: https://openweathermap.org/weather-conditions

NOTE: The endpoints openweather.org provide do not, by default, include an https:// prefix.
If you intend to use Javascript's fetch API, you'll need to include this prefix in your endpoint,
or else you'll receive a status error of 404.

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

i.e. fetch('https://...').then(function() { //do stuff })




Some Requirements =========================================================================

  __  Use Handlebars to display weather data

  __  Use Bootstrap

  __  Use Local Storage (for Pt. 3)

  __  Be conscious of your style and patterns

  _X_  To get started, fork and clone this repo and submit a pull-request when you're finished.






User Stories Pt. 1  =========================================================================
To start with, your project will look something like this:

https://camo.githubusercontent.com/58ec65ded9e453b8a9d8ebf30e413c63d58203fb/68747470733a2f2f7777772e70726f6a65637473686966742e696e666f2f77702d636f6e74656e742f75706c6f6164732f323031372f31322f776561746865722e706e67

And here are the following scenarios we want your project to be able to handle or accomplish:

  __  A user should be able to:

      __  Enter a city into the url

      __  Click "Search"

      __  Get weather data on the city they entered

  __  A user should be able to see the current temperature (in imperial units).

  __  A user should be able to see the current conditions (whether it's cloudy, raining, etc).

  __  When a user does another search, their first search should be replaced.





User Stories Pt. 2 =========================================================================

Once you finish with that first part, we'll want to additionally show some forecast data. The application should look something like this:

https://camo.githubusercontent.com/87a2888ca08d16881255ce54ad93508a4852f9a3/68747470733a2f2f7777772e70726f6a65637473686966742e696e666f2f77702d636f6e74656e742f75706c6f6164732f323031372f31322f77656174686572322e706e67

And here are the next scenarios your weather app should account for:

  __  A user should be able to do all he/she could do in the first part.

  __  When a user searches, they should additionally see a 5-day forecast

  __  Each of the five days should have an associated:

    __  Day of the week

    __  Weather condition

    __  Temperature

  __  Converting timestamps to days of the week may prove to be difficult. You may (but don't have to) use Moment.js.






User Stories Pt. 3 (Optional Extension) =========================================================================

  __  In addition to all the previous stories, a user should be able to see an icon that's associated with the current weather and one for
      each day in the 5 day forecast.

  __  After a user has searched a city (and that city's weather information is currently displaying), the user should see a "Set as Default" button.

  __  When the user  clicks this button, there should be some indication that the current city is set as their default city. If the user refreshes the page,
      instead of a blank screen and search bar, their default city's info should come up.

  __  Add a button to the interface that will allow the user to automatically look up their current location using the Geolocation API:
      https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation

  __  Alter the styling based on the weather type to give the user a different experience based on the weather of their selected city

  __  Place a map on the page with the current location shown using the google maps embed API: https://developers.google.com/maps/documentation/embed/.

  __  Super secret "rockstar" extension: add in nearby cities to the map with the current temperature and weather shown on the map "pin"
      and let them click a "pin" to switch to that city's weather.
