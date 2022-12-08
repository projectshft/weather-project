// Part 1: proof of concept
// 1. create a script that will interact with a function
// 2. first empty the div we will be putting info in, otherwise it'll continually pop up. create a function that finds the info we are looking for through a for loop 
// 3. move the script into html, then compile using handlebars(this is now our template), using that template pass in the element to get what we need, finally append it.

// 1. we need to put something in our array of cities = []. Fetch will help us with that but we need to get there first
// 2. using the click function when the search button is clicked have the user input be passed into a new function called fetch
// 3. fetch should have an ajax function set up and will have a 'GET' and a few other things along with the API and the the query you've made meaning the user input that was passed to this function. success should return a new function which will most likely be to add our new data into the cities array. make sure to pass in the data. call it addcity(data)
// 4. addcity(data) will break down further what we need in the form of an object. we may need to employ some logic if needs. wrap what we'd like to correspond to our script in the 

// 5 day forecast:
// 1. Keep in mind that the API will give you an array of 40 items. this encompasses data for 5 days. Thus every 8 represents 1 day. So we will just need to get the average of each 8.
// 2. create our script
// 3. you can use the same functions, basically copy and paste for their respective areas.


let cities = [];
let fiveDayArray = []; //how do we want to see the info pop up here? How do we want to use it?

$(".search").click(function () {
  let userSearch = $("#search-query").val();

  fetch(userSearch);
  fetchFiveDay(userSearch);
});

let fetch = function (query) {
  $.ajax({ 
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=651b4326c31add8e66f753623aae609d",
    type: "GET",
    success: function (data) {
        addCity(data);
    }, 
    error: function (error) {
        console.log(`Error ${error}`);
    }
  });
};

let fetchFiveDay = function (query) {
  $.ajax({ 
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=651b4326c31add8e66f753623aae609d",
    type: "GET",
    success: function (data2) {
        addCity(data2);
    },
    error: function (error) {
        console.log(`Error ${error}`);
    }
  });

}



let addCity = function (data, data2) {
  let city = { 
    temperature: `${Math.round(((data.main.temp - 273.15) * (9/5) + 32))}\u00B0 F` || null,
    cityName: data.name || null,
    clouds: data.weather[0].main,
    imageURL: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  }

  averageFiveDay(data2);

  cities.push(city);

  renderWeather();
}

let averageFiveDay = function (data2) {
console.log(data2)
  let one = 0;
  let two = 0;
  let three = 0;
  let four = 0;
  let five = 0;

  for (let i = 0; i < data2.list.length; i++) {
    const element = data2.list[i].main.temp;

    if(i+1 <= 8){
      one = one + element.temp
    } else if(i+1 > 8 && i+1 <= 16){
      two = two + element.temp
    } else if(i+1 > 16 && i+1 <= 24){
      three = three + element.temp
    } else if(i+1 > 24 && i+1 <= 32){
      four = four + element.temp
    } else{
      five = five + element.temp
    }
    
  };
  // averageArray.push((one/8));
  // averageArray.push((two/8));
  // averageArray.push((three/8));
  // averageArray.push((four/8));
  // averageArray.push((five/8));

  let oneDay = {
    clouds: data2.list[0].weather.main,
    temperature: (((one/8)- 273.15) * (9/5) + 32),
    imageURL: "http://openweathermap.org/img/wn/" + data2.weather[0].icon + "@2x.png",
    day: findDay(data2)
  }

  fiveDayArray.push(oneDay);
};

let findDay = function (data2) {
  let timeStamp = data2.list[0].dt;
  let date = new Date(timeStamp);

  let newDate = date.getDate()+ 
  "/"+(date.getMonth()+1)+
  "/"+date.getFullYear()

  return getDay(newDate);
}



let renderWeather = function () {
  $(".weather-display").empty();
  $(".weather-display2").empty();

  for (let i = 0; i < cities.length; i++) {
    const element = cities[i];
    
    let source = $("#weather-template").html();
    let template = Handlebars.compile(source);
    let newHTML = template(element);

    $(".weather-display").append(newHTML);
  }

  for (let j = 0; j < fiveDayArray.length; j++) {
    const forecastElement = fiveDayArray[j];
    
    let sourceTwo = $("#weather-template2").html();
    let templateTwo = Handlebars.compile(sourceTwo);
    let newHTMLTwo = templateTwo(forecastElement);

    $(".weather-display2").append(newHTMLTwo);
  }
}

renderWeather()