var temperatures = [];

document.querySelector('.search').addEventListener('click', function(){
    var sha = document.querySelector('#search-query').value.trim();

    if(!sha) return;

    document.querySelector('#search-query').value = '';

    fetchData(sha) ;

});

function fetchData(city) {
    const apiKey = '328194b3220e55747593aa5dc4c28a50';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`;

fetch(forecastUrl)
  .then(response => response.json())
  .then(data => addForecast(data))
  .catch(error => console.error('Forecast fetch error:', error));

    ;
;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })

        .then(data => addWeather(data))
        .catch(error => {
            document.querySelector('.current.temperature').innerHTML = `<p class="text-danger">${error.message}</p>
            `;
            console.error('Error fetching weather:', error);
        });
}

function addWeather(data) {
    const temperature = data.main.temp;
    const city = data.name;
    const description = data.weather[0].description;
    
    document.querySelector('.current.temperature').innerHTML= `
    <h3>${city}</h3>
    <p>${temperature}°F - ${description}</p>
    `;

    temperatures.push(temperature);
}

function addForecast(data) {
    const forecastEl = document.querySelector('.forecast');
    forecastEl.innerHTML = ''; // clear previous

    const forecastMap = new Map();

    data.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!forecastMap.has(day) && date.getHours() === 12) {
            forecastMap.set(day, item);
        }
    });

    let count = 0;
    forecastMap.forEach((item, day) => {
        if (count >= 5) return; // only 5 days
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].main;
        const icon = item.weather[0].icon;

        forecastEl.innerHTML += `
            <div class="forecast-day">
                <p class="desc">${desc}</p>
                <h4 class="temp">${temp}°</h4>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
                <p class="day-name">${day}</p>
            </div>
        `;
        count++;
    });
}
