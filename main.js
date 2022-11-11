function clearSearch() {
  let $search = $('#search-query');
  $search.each( function(input) {
    $($search[input]).val('')
  })
}


let cities = [];


$('.search').on('click', function(e) {
  e.preventDefault();
  let city = $('#search-query').val();
  console.log('click');

  fetch(city);
  $('#search.query').empty();

})


var addCity = function (data) {
  cities = [];

  let location = {
    city: data.name,
    temp: data.main.temp + ' °'
  };

  for (let i = 0; i < data.weather.length; i++) {
    const element = data.weather[i];
    location.main = element.main;
  }

  cities.push(location);

  renderCity();
};


var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fd29eda782d2ed239fe8bc7bac217402&units=imperial`,
    dataType: 'json',
    success: function (data) {
      addCity(data);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};


var renderCity = function () {
  $('.cities').empty();

  for (let i = 0; i < cities.length; i++) {
    const location = cities[i];
    
    var source = $('#city-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(location);

    $('.cities').append(newHTML);
  }
  clearSearch();
};

renderCity();



