// Sample API Call with my API Key 

// http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=21653f29a7d16fbade1183b04d4783c1


/////////////////////////// Model ///////////////////////
var weatherModel = {
    apiURL: 'http://api.openweathermap.org/data/2.5/weather?q=',
    apiKey: '&APPID=21653f29a7d16fbade1183b04d4783c1',
    cityWeather: [],
    fetch:  function fetch(query) {
        $.ajax({
            method: "GET",
            url: `${this.apiURL} + ${query} + ${this.apiKey}`,
            dataType: "json",
            success: function (data) {
                addWeather(data);
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
}






/////////////////////////// View ///////////////////////












/////////////////////////// Controller ///////////////////////

//1) TODO: When a user clicks the search button, grab their input
$('.search').on('click', function () {
    var userText = $('#search-query').val();
   weatherModel.fetch(userText);
});

