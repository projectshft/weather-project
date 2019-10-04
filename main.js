// // Weather API Project
// const searchData = [];
// const addWeather = function (data) {
//   const city = {
//     currentTemp: data.main.temp,
//   };
//   const condition = {
//     currentConditions: data.weather.main
//   };
//
//   searchData.push(addWeather);
// };

//Use handlebars to render template to the page
const renderData = function () {
  $('#data').empty();

  searchData.forEach(function(){
    console.log();

    const source = $('#search-template').html();
    const template = Handlebars.compile(source);
    const newHTML = template(searchData);

    $('#data').append(newHTML);
  })
};

// function that will fetch data from open weather API according to input once button is clicked.
const fetchData = function (search) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=durham,us&appid=488b51fddad63d1ec9b9f39876fb6abc",
    dataType: "json",
    success: function(data) {
      // addWeather(data);
      console.log(data);
      // renderData();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=durham,us&appid=488b51fddad63d1ec9b9f39876fb6abc",
    dataType: "json",
    success: function(data) {
      // addWeather(data);
      console.log(data);
      // renderData();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// add click event and grab value of input
$('#search').on('click', function() {
  const search = $('#search').val();
  console.log('click');

  fetchData();
});

renderData();
