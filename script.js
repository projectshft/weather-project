//1 VIEW -->take input from search box/button
$('.btn-search').on('click', function (e) {
    e.preventDefault();
    var search = $('#searchField').val();
    fetch(search);
    fetch2(search);
});


//2 DATA -->send asynchronous HTTP (Ajax) request to API 

var fetch = function (query) {
    //compile template in JS using Handlebars
    var source = $('#currentWeather-template').html();
    var template = Handlebars.compile(source);

    $.ajax({
        method: 'GET',
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + query + ",us&units=imperial&APPID=2207b3e862065d895f387f6ef45e43ad",
        dataType: "json",

        success: function (data) {
            //fill template with data
            var html = template(data);
            $('#weather-data').html(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};


var fetch2 = function (query) {
    //compile template in JS using Handlebars
    var source2 = $('#forecast-template').html();
    var template2 = Handlebars.compile(source2);

    //5 day forecast data
    $.ajax({
        method: 'GET',
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&units=imperial&APPID=2207b3e862065d895f387f6ef45e43ad",
        dataType: "json",

        success: function (data) {
            //change given date/time format to just day of week
            console.log(data);

            //fill template with data
            var html2 = template2(data);
            $('#weather-forecast').html(html2);

            // THIS WORKED AND i WANT TO KEEP IT FOR REFERENCE
            //1. jQuery select DOM element

            var dates = $("p.day")
            console.log(dates);

            //2.jQuery - access NodeList items

            for (var i = 0; i < dates.length; i++) {
                var dayText = dates[i].innerText;
                console.log(dayText);

            //3. convert text date to name of week
                var dayName = moment(dayText).format("ddd");
                console.log(dayName);
                return(dayName);
            };

            $('p.day').replaceWith("<p class='day'>" + dayName + "</p>");

            // var $dayText = $("p.day").each(function (index) {
            //         (this.innerText);
            //         return ($dayText);
            //     });
            //     //not grabbing the correct this
            // $($dayText).replaceWith("<p class='day'>" + moment().format("ddd") + "</p>");





        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }

    });
};










//loop thru all 5 days and get the weather icon id
// var id =  list.i.weather.0.icon
// return id;
//  $.ajax(id){
//     method: 'GET',
//         url: "http://http://openweathermap.org/img/w/" + id + ".png&APPID=2207b3e862065d895f387f6ef45e43ad",
//     dataType: "json",

//     success: function (data) {
//         //fill template with data
//         var html2 = template2(data);
//         $('#weather-forecast').html(html2)
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//         console.log(textStatus);
//     }
// });