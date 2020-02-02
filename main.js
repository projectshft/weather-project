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
let defaultCity = '';
let defaultInfo = [];
let app = WeatherProject();
let currentPosition = $('#status')[0];
let mapDisplay = $('#mapholder')[0];

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

const fetchWeatherOfCurrentLocation = async(query) => {
	const res = await fetch(
	    'https://api.openweathermap.org/data/2.5/weather?'+query+'&units=imperial&appid=8349ad5e6bba395d3c4a42b77ef38130'
	  )
	.catch((error) => {
  		console.error('Error:', error);
  	});
  		
	const json = await res.json();

  	console.log(json);

	app.formatCurrentData(json);
	app.renderCurrentWeather();

	//get data for 5 days forcast
	defaultCity = json.name;
	fetchFiveDaysForcast(defaultCity);
	saveToLocalStorage(json);
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else { 
		currentPosition.val("Geolocation is not supported by this browser.");
	}
}

function showPosition(position) {
	let mapKey = 'AIzaSyCue4XtYUuHjzIl0ZFncALl9an08JNIWUw';
	let lat = position.coords.latitude;
	let long = position.coords.longitude
	let latlong = `${lat},${long}`;
	let maplink = `https://www.openstreetmap.org/#map=18/${lat}/${long}`;
	let query = `lat=${lat}&lon=${long}`;

  	currentPosition.innerHTML = `<a href="${maplink}" target="_blank">Latitude: ${lat} <br>Longitude: ${long}</a>`;
  	fetchWeatherOfCurrentLocation(query);

  	let img_url = `https://www.google.com/maps/embed/v1/view?key=${mapKey}&center=${latlong}&zoom=13`;
  	mapDisplay.innerHTML =`<iframe width="450" height="250" frameborder="0" style="border:0" src=${img_url}></iframe>`;
}

let getDefaultInfoFromLocalStorage = function() {
	//get default city info from the local storage if  we have it
	defaultInfo = getFromLocalStorage();

	//if nothing in local storage get the info from API 
	if(defaultInfo.length === 0) {
		defaultInfo = fetchCurrentWeather(defaultCity);
	}

	app.formatCurrentData(defaultInfo);
	app.renderCurrentWeather();

	//clear the search input field
	$('#search-query').val('');

	getLocation();

	//get data for 5 days forcast
	//fetchFiveDaysForcast(defaultCity);
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
});

//retrive the current location from the local storage
$('#defaultLocation').on('click', function () {	
	getDefaultInfoFromLocalStorage();
});

//show my location request
$('#find-me').on('click', function() {
	getLocation();
	$('#status, #maplink').toggle('slow');
})

