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
	let $currentWeather = $('.current-weather');
	let $forcast = $('.forcast');

	//after the weather API call we format data for later use 
	let formatCurrentData = function(result) {	
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


	return {
		forcast: forcast,
		//renderForcast: renderForcast,
		renderCurrentWeather: renderCurrentWeather,
		formatCurrentData: formatCurrentData,
		//formatForcastData: formatForcastData
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