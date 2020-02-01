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
			timeOfDay = moment.unix(result.list[1].dt).format('h:mm:ss a');
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

//8349ad5e6bba395d3c4a42b77ef38130
//https://api.openweathermap.org/data/2.5/weather?q=London&appid=8349ad5e6bba395d3c4a42b77ef38130


let app = WeatherProject();

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
	app.formatCurrentData(json);
	app.renderCurrentWeather();

	//get data for 5 days forcast
	fetchFiveDaysForcast(query);
}

const fetchFiveDaysForcast = async(query) => {
	const res = await fetch(
	    'https://api.openweathermap.org/data/2.5/forecast?q='+query+'&units=imperial&appid=8349ad5e6bba395d3c4a42b77ef38130'
	  );
	const json = await res.json();

  	console.log(json);
	app.formatForcastData(json);
	app.renderForcast();
}


//openweathermap.org/data/2.5/forecast?q=München,DE&appid=


$('.search').on('click', function () {
  let search = $('#search-query').val();

  fetchCurrentWeather(search);
  $('#search-query').val('');

});

//function to conver temp measurements
let temperatureConversion = function(value, measurements) {
	return ((value - 273.15)*1.8) + 32;
}