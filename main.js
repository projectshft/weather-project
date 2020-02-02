let WeatherProject = function() {

	let forcast = [];

	let forcastObj = {
		city: '',
		state: '',
		country: '',
		temperature: '',
		description: '',
		imageURL: '',
		dayOfWeek: ''
	}

	//div to display current weather
	let $currentWeather = $('.current-weather');

	//div to display 5 days forcast
	let $forcast = $('.forcast');

	let timeOfDay = '';

	//after the weather API call we format data for later use 
	let formatCurrentData = function(result) {	
		forcast = [];
		forcastObj = {};

		forcastObj.city = result.name;
		forcastObj.state = '';
		forcastObj.country = result.sys.country;
		forcastObj.temperature = Math.round(result.main.temp); //temperatureConversion(result.main.temp);
		forcastObj.description = result.weather[0].main;

		let iconCode = result.weather[0].icon;
		//get the icon from the openweathermap.org
		let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png"
		forcastObj.imageURL = iconURL;
		forcastObj.dayOfWeek = '';
		     
		forcast.push(forcastObj);

		//sconsole.log(forcast);
		return forcast;
	}

	let renderCurrentWeather = function() {

		$currentWeather.empty();

		for(let i = 0; i < forcast.length; i++) {
			let forcastTemplate = Handlebars.compile($('#current-weather-template').html());
			let forcastView = forcastTemplate(forcast[i]);
			$currentWeather.append(forcastView);
		}
	}

	let formatForcastData = function(result) {
		forcast = [];

		for(let i = 0; i < result.list.length; i++) {
			//we need the time to match with the time of the forcast
			timeOfDay = moment.unix(result.list[0].dt).format('h:mm:ss a');
			//console.log('Time of day: ' + timeOfDay);

			//we get the time of the data element to match with the time of forcast
			let timeToMatch = moment.unix(result.list[i].dt).format('h:mm:ss a');
			//console.log('Time to match: ' + timeToMatch);

			//if timeOfDay matches timeToMatch, get the data to display the 5 days forcast
			if (timeOfDay === timeToMatch) {
				//convert value from the data to a format we can use 
				let timestamp =  moment.unix(result.list[i].dt);

				//clear the object
				forcastObj = {};

				forcastObj.city = result.city.name;
				forcastObj.state = '';
				forcastObj.country = result.city.country;
				forcastObj.temperature = Math.round(result.list[i].main.temp);
				forcastObj.description = result.list[i].weather[0].main;

				let iconCode = result.list[i].weather[0].icon;

				//get the icon from the openweathermap.org
				let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png"
				forcastObj.imageURL = iconURL;

				
				let dayOfWeek = moment(timestamp).format('dddd');
				//console.log(dayOfWeek);
				if (dayOfWeek === 'Wednesday') {
					dayOfWeek = 'Wed';
				}

				forcastObj.dayOfWeek = dayOfWeek;

				forcast.push(forcastObj);
			}

		 }   
		
		//console.log(forcast);

		return forcast;

	}

	let renderForcast = function() {

		$forcast.empty();

		for(let i = 0; i < forcast.length; i++) {
			let forcastTemplate = Handlebars.compile($('#forcast-template').html());
			let forcastView = forcastTemplate(forcast[i]);
			$forcast.append(forcastView);
			$('.col-md-2').attr('class', 'forcast-box');
		}
	}

	return {
		forcast: forcast,
		renderForcast: renderForcast,
		renderCurrentWeather: renderCurrentWeather,
		formatCurrentData: formatCurrentData,
		formatForcastData: formatForcastData
	}
}

const STORAGE_ID = 'weather-project';
const defaultCity = 'Durham';
let defaultInfo = [];

//8349ad5e6bba395d3c4a42b77ef38130

let app = WeatherProject();


let saveToLocalStorage = function (defaultData) {
  localStorage.setItem(STORAGE_ID, JSON.stringify(defaultData));
}


let getFromLocalStorage = function () {
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}

//use async await with fetch()
const fetchCurrentWeather = async(query) => {
	const res = await fetch(
	    'https://api.openweathermap.org/data/2.5/weather?q='+query+'&units=imperial&appid=8349ad5e6bba395d3c4a42b77ef38130'
	  )
	.catch((error) => {
  		console.error('Error:', error);
  	});
  		
	const json = await res.json();

  	console.log(json);

  	//get state based on logtitud and latitude
	// state = getState(json.coord.lat, json.coord.lon);
	// console.log(state);
	
	app.formatCurrentData(json);
	app.renderCurrentWeather();

	//get data for 5 days forcast
	fetchFiveDaysForcast(query);

	if(query == defaultCity) {
		saveToLocalStorage(json);
	}
}

const fetchFiveDaysForcast = async(query) => {
	const res = await fetch(
	    'https://api.openweathermap.org/data/2.5/forecast?q='+query+'&units=imperial&appid=8349ad5e6bba395d3c4a42b77ef38130'
	  )
	.catch((error) => {
		console.error('Error:', error);
  	});
	const json = await res.json();

  	console.log(json);
	app.formatForcastData(json);
	app.renderForcast();
}

//get info about default city weather and 5 days forcast from local storage 
$(document).ready(() => {
	getDefaultInfoFromLocalStorage();
})

$('.search').on('click', function () {
	let search = $('#search-query').val();

	if(search == '') {
		alert('Please Enter the City name');
	} else {
		fetchCurrentWeather(search);
		$('#search-query').val('');
	}
  	//test of the getState function
	//getState(41.85, -87.65);

});

$('#defaultLocation').on('click', function () {

	getDefaultInfoFromLocalStorage();
});

let getDefaultInfoFromLocalStorage = function() {
	//get default city info from the local storage if  we have it
	defaultInfo = getFromLocalStorage();

	//if nothing in local storage get the info from API 
	if(defaultInfo.length === 0) {
		defaultInfo = fetchCurrentWeather(defaultCity);
	}

	app.formatCurrentData(defaultInfo);
	app.renderCurrentWeather();

	//get data for 5 days forcast
	$('#search-query').val('');

	//get data for 5 days forcast
	fetchFiveDaysForcast(defaultCity);
}

let geoFindMe = function() {

  const status = $('#status').val();
  const mapLink = $('#map-link').val();

  mapLink.href = '';
  mapLink.textContent = '';

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

$('#find-me').on('click', function() {
	geoFindMe();
});

//get the state by the coordinates using opencagedate API
//API: 6c75c2c5ea264615ab072b2ebf5fad83
let getState = async(lat, long) => {

	const res = await fetch(
		'https://api.opencagedata.com/geocode/v1/json?q='+lat+'+'+long+'&key=6c75c2c5ea264615ab072b2ebf5fad83'
	  )
	.catch((error) => {
		console.error('Error:', error);
  	});

	const json = await res.json();

  	console.log(json);
  	console.log(json.results[0].components.state_code);
//debugger
	return json.results[0].components.state_code;
}

//function to conver temp measurements
let temperatureConversion = function(value, measurements) {
	return ((value - 273.15)*1.8) + 32;
}
