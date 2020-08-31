const weatherProject = () => {
    let days = Collection();
    let $days = $('.days');
    let $today = $('.today');

    //Create model for the current day
    const createDay = (data) => {
        $today.empty();
        //convert Kelvin to Farenheit
        let farenheit = Math.round((data.main.temp - 273.15) * (9/5) + 32);

        let day = {
            temperature: `${farenheit}°`,
            city: data.name,
            condition: data.weather[0].description,
        };

        let dayModel = Model(day);
        //add2 is used for the current day
        days.add2(dayModel);
    };

    //Create model for 5 days after current day
    const createWeek = (weekData) => {
        $days.empty();
        
        //get UTC of current time and convert to date for comparison
        let currentUnix = new Date(Date.now());
        let currentDate = currentUnix.toLocaleDateString("en-US")

        //stores formatted dates for every day of the upcoming week for comparison 
        let datesOfWeek = [];

        //stores data to be modeled for each separate day
        let weekDays = [];

        weekData.list.forEach ((item) => {
            let date = new Date(item.dt * 1000).toLocaleDateString("en-US");

            let dayOfWeek = moment.utc(item.dt * 1000).format('dddd');

            let farenheit = Math.round((item.main.temp - 273.15) * (9/5) + 32);

            let conditions = item.weather[0].description;

            //compares dates and only pushes data for separate days
            if (date != currentDate && !datesOfWeek.includes(date)) {
                
                let week = {
                    temperature: `${farenheit}°`,
                    condition: conditions,
                    weekDay: dayOfWeek
                }
                weekDays.push(week) 
            }
            datesOfWeek.push(date)
        })

        //models data in weekDays array
        weekDays.forEach((element) => {
            let weekModel = Model(element)  
            days.add(weekModel)
        })
    }

    //Compiles and appends model for current day
    const renderDay = () => {
        $today.empty();

        let todaysModel = days.todayModel[0]

        let todayTemplate = Handlebars.compile($('#today-template').html());

        let todayView = View(todaysModel, todayTemplate);

        
        $today.append(todayView.render());
    }

    //Compiles and appends model for days of the week following current day
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
        days,
        renderWeek,
        renderDay,
        createDay,
        createWeek,
    }

}

const app = weatherProject();

app.days.change(() => {
    app.renderDay();
    app.renderWeek();
});

app.renderDay();
app.renderWeek();


// Fetch data for current day
const fetchCurrent = (query) => {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=22ef8f05e874e286b2f628c4dbc76cc6`,
      dataType: "json",
      success: (data) => {
          app.createDay(data);
        },
      error: (jqXHR, textStatus, errorThrown) => {
          console.log(textStatus);
        }
    });
};

//Fetch data for upcoming week
const fetchWeek = (query) => {
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=22ef8f05e874e286b2f628c4dbc76cc6`,
        dataType: "json",
        success: (weekData) => {
            app.createWeek(weekData);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(textStatus);
        }
    });
}

//Events
$('.search').click((e) => { 
    e.preventDefault();
     
    let search = $('#input-city').val();

    if(search) {
        fetchCurrent(search);
        fetchWeek(search);
    };

});
