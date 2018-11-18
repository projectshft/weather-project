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
            $('#weather-data').html(html)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

var fetch2 = function (query) {
    //compile template in JS using Handlebars
    var source2 = $('#forecast-template').html();
    var template2 = Handlebars.compile(source2);

    $.ajax({
        method: 'GET',
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&units=imperial&APPID=2207b3e862065d895f387f6ef45e43ad",
        dataType: "json",

        success: function (data) {
            //fill template with data
            var html2 = template2(data);
            $('#weather-forecast').append(html2)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}