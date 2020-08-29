//Set up HTML 
    //Add display for one day 
    //Add display for one week
//

//Set up CSS as needed    

//Set up JS
    //Setup VMC separations according to rules of data flow 
        //Model holds data to be rendered and any changes called by controller
        //View holds render info and re-renders when changes to the model occur
        //Controller holds functions that model takes in to make changes

    //Link API
        //AJAX

    //Input field takes a city as an argument
        //Search weather data on-click
    
    //Display current temperature
    //Display current weather conditions
    //Replace data from first search after new search
    //Display 5-day weather forecast
        //Try Moment.js to convert Unix to days of the week
        //Push into the days array one element per day for 4 days after current  
        //Each day as a different array element

//

const weatherProject = () => {
    let days = Collection();
    let $days = $('.days');
    let $today = $('.today');

    const createDay = (data) => {
        let farenheit = Math.round((data.main.temp - 273.15) * (9/5) + 32);
        let day = {
            temperature: `${farenheit}°`,
            city: data.name,
            condition: data.weather[0].description,
        }

        let dayModel = Model(day);

        days.add(null , dayModel)
        renderDay(); //Change to renderDay after you create the function
    };

    const createWeek = (weekData) => {
        let currentUnix = new Date(Date.now());
        let currentDate = currentUnix.toLocaleDateString("en-US")
        let datesOfWeek = [];

        let week = {
            city: weekData.city.name
        }

        weekData.list.forEach ((item) => {
            let date = new Date(item.dt * 1000).toLocaleDateString("en-US");

            let farenheit = Math.round((item.main.temp - 273.15) * (9/5) + 32);

            let conditions = item.weather[0].description;
            
            if (date != currentDate && !datesOfWeek.includes(date)) {
                week.temperature = farenheit;
                week.condition = conditions;
    
                let weekModel = Model(week)
                days.add(weekModel)
            }
            datesOfWeek.push(date)
        })
      renderWeek();
    }

    const renderDay = () => {
        $today.empty();

        for (let i = 0; i < days.models.length; i++) {
            let todayModel = days.models[i]

            let todayTemplate = Handlebars.compile($('#today-template').html());

            let todayView = View(todayModel, todayTemplate);

            $today.append(todayView.render());

        }
        
    }
    const renderWeek = () => {
        $days.empty();

        for (let i = 0; i <days.models.length; i ++) {
            let daysModel = days.models[i]
        
            let daysTemplate = Handlebars.compile($('#days-template').html());
    
            let daysView = View(daysModel, daysTemplate);

            $days.append(daysView.render());
        }
      
    };

    return {
        renderWeek,
        createDay,
        createWeek
    }

}

const app = weatherProject();

const fetchCurrent = (query) => {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=22ef8f05e874e286b2f628c4dbc76cc6`,
      dataType: "json",
      success: (data) => {
          //console.log(data)
          app.createDay(data);
        },
      error: (textStatus) => {
          console.log(textStatus);
        }
    });
};

const fetchWeek = (query) => {
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=22ef8f05e874e286b2f628c4dbc76cc6`,
        dataType: "json",
        success: (weekData) => {
            console.log(weekData)
            app.createWeek(weekData);
        },
        error: (textStatus) => {
            console.log(textStatus);
        }
      });
}

$('.search').on('click', function (e) { 
    e.preventDefault();

    let search = $('#input-city').val();

    fetchCurrent(search);
    fetchWeek(search);
});