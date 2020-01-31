let weatherModel = [];

// search button event listener
$('#search').click(function () {
    let searchValue = $('#searchInput').val();
    console.log(' inside click function ', searchValue)
    apiCall(searchValue)
})

// API call for current weather with key
// key  096f3282b86fa805756f58092f5d2481   4102008879dcae5fa2ce2d42e5bf66ba

var apiCall = function (searchVal) {
    console.log('inside render value of searVal ', searchVal);

    weatherModel = [];
    //$('.books').append('<div class="spinner-grow text-danger" role="status"><span class="sr-only">Loading...</span></div>')
    setTimeout(function () {
        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&APPID=096f3282b86fa805756f58092f5d2481",
            dataType: "json",

            success: function (data) {
                console.log(data)
                console.log(data.weather[0].main) // rain
                console.log('description ', data.weather[0].description)
                //console.log('name ',data.name)
                console.log('temperature ', data.main.temp) // kalvin to F  (280.24K − 273.15) × 9/5 + 32 = 44.762°F

                filteredData(data);

                renderView(weatherModel)

                //     for (var i = 0; i < data.items.length; i++) {
                //         addBook(data.items[i].volumeInfo)
                //         console.log(data.items[i].volumeInfo)
                //     }
                //     booksRender(books)
                // },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            }
        });

    }, 0);
};

// need function to convert kalvin to farenhaight 
var kelvinToFar = function (temp) {
    return parseInt((temp - 273.15) * 9 / 5 + 32) // kalvin to F  (280.24K − 273.15) × 9/5 + 32 = 44.762°F
};

// way to store returned information and Model set up
const filteredData = function (mainData) {
    var weatherObj = {};

    weatherObj["weather"] = mainData.weather[0].description;
    weatherObj["cityName"] = mainData.name;
    weatherObj["temperature"] = kelvinToFar(mainData.main.temp);
    console.log('temperature ', mainData.main.temp)

    // weatherObj["imageURL"] = "./notFound.PNG"

    weatherModel.push(weatherObj);
    console.log('weather model inside filteredData ', weatherModel)

}
// function to sort out information and get only the one to display

// function or call to display information to view
let renderView = function (weatherModel) {
    console.log('renderView mainData value ', weatherModel)
    for (var i = 0; i < weatherModel.length; i++) {
        var source = $('#main-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(weatherModel[i]);
        $('.mainWeather').append(newHTML);
    }
};