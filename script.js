
// search button event listener
$('#search').click(function () {
    let searchValue = $('#searchInput').val();
    console.log(' inside click function ', searchValue)
    apiCall(searchValue)
})

// API call for current weather with key
// key  096f3282b86fa805756f58092f5d2481   4102008879dcae5fa2ce2d42e5bf66ba
// need function to convert kalvin to farenhaight 
var apiCall = function (searchVal) {
    console.log('inside render value of searVal ', searchVal);
    
    localWeather = [];
    //$('.books').append('<div class="spinner-grow text-danger" role="status"><span class="sr-only">Loading...</span></div>')
    setTimeout(function () {
        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal +"&APPID=096f3282b86fa805756f58092f5d2481",
            dataType: "json",
            
             success: function (data) { 
                 console.log(data)
                 console.log(data.weather[0].main)  // rain
                 console.log('description ',data.weather[0].description)
                 console.log('name ',data.name)
                 console.log('temperature ', data.main.temp )  // kalvin to F  (280.24K − 273.15) × 9/5 + 32 = 44.762°F
             }

            //     for (var i = 0; i < data.items.length; i++) {
            //         addBook(data.items[i].volumeInfo)
            //         console.log(data.items[i].volumeInfo)
            //     }
            //     booksRender(books)
            // },
            // error: function (jqXHR, textStatus, errorThrown) {
            //     console.log(textStatus);
            // }
        });

    }, 0);
};

// way to store returned information and Model set up
// function to sort out information and get only the one to display
// function or call to display information to view