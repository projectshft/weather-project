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
//

// const weatherProject = () => {
//     let days = Collection();

//     let $days = $('.days')

//     const renderDays = () => {
//         $days.empty();

//         for (let i = 0; i <days.models.length; i ++) {
//             let daysModel = days.models[i]
        
//             let daysTemplate = Handlebars.compile($('#day-template').html());
    
//             let daysView = View(daysModel, daysTemplate)

//             $days.append(daysView.render());
//         }
      
//     }

//     return {
//         renderDays,
//     }

// }

var fetchInfo = (query) => {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=22ef8f05e874e286b2f628c4dbc76cc6`,
      dataType: "json",
      success: (data) => {
        console.log(data);
      },
      error: (textStatus, errorThrown) => {
        console.log(textStatus);
      }
    });
};



$('.search').on('click', function (e) {
    e.preventDefault();
    var search = $('#input-city').val();
    
    fetchInfo(search);
});