// let data = {
//   "cod": "200",
//   "message": 0,
//   "cnt": 40,
//   "list": [
//   {
//   "dt": 1668103200,
//   "main": {
//   "temp": 297.24,
//   "feels_like": 297.85,
//   "temp_min": 297.24,
//   "temp_max": 300.22,
//   "pressure": 1013,
//   "sea_level": 1013,
//   "grnd_level": 995,
//   "humidity": 82,
//   "temp_kf": -2.98
//   },
//   "weather": [
//   {
//   "id": 500,
//   "main": "Rain",
//   "description": "light rain",
//   "icon": "10d"
//   }
//   ],
//   "clouds": {
//   "all": 100
//   },
//   "wind": {
//   "speed": 4.17,
//   "deg": 197,
//   "gust": 5.45
//   },
//   "visibility": 10000,
//   "pop": 0.2,
//   "rain": {
//   "3h": 0.12
//   },
//   "sys": {
//   "pod": "d"
//   },
//   "dt_txt": "2022-11-10 18:00:00"
//   },
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {},
//   {}
//   ],
//   "city": {
//   "id": 4671654,
//   "name": "Austin",
//   "coord": {},
//   "country": "US",
//   "population": 790390,
//   "timezone": -21600,
//   "sunrise": 1668084750,
//   "sunset": 1668123445
//   }
//   }


//   // for (let i = 0; i < data.list.length; i++) {
//   //   const element = data.list[i];
//   //   // console.log(element);
//   //   // console.log(data.list[i].weather);
//   //   console.log(data.list[i].main.temp);
    
//   // }



//   // var addCity = function (data) {
//   //   cities = [];
  
//   //   for (let i = 0; i < data.list.length; i++) {
//   //     const element = data.list[i];    
//   //     let location = {
//   //       city: data.city.name,
//   //       main: element.weather[i].main,
//   //       temp: element.main.temp
//   //     };
  
//   //     cities.push(location);
//   //     }
  
//   //   renderCity();
//   // };









    // for (let i = 0; i < datas.length; i++) {
    //   const element = datas[i];
    //   let condition = datas.weather[i].main;
    //   console.log(condition);
      
    // }



    // for (const key in datas) {
    //     const element = datas[key];
    //     let condition = datas.weather[key].value().main;
    //     console.log(condition);

        

    // }


    
  // for (let i = 0; i < datas.length; i++) {
  //   console.log(i);
  //   const element = datas[i];
  //   console.log('hello');
    // console.log(data.list[i].weather);
    // console.log(data.list[i].main.temp);
    // console.log(datas.name + '  name');
    // console.log(datas.weather.main + '  condition');
    // console.log(datas.main.temp + '  temperature');
    
  // }






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
      let icon = element.icon;
      location.main = element.main;
      location.icon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
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

      var source = $('#weather-icon-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(location);
      $('.cities').append(newHTML);

    }
    clearSearch();
  };
  
  renderCity();




//-------------------------------------------------------------------------------------------------------------------------------------------------------//









  $('.search').on('click', function(e) {
    e.preventDefault();
    let city = $('#search-query').val();
    console.log('click');
  
    fetch(city);
    fetchForecast(city);
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
      let icon = element.icon;
      location.main = element.main;
      location.icon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
  
    cities.push(location);
  
    renderCity();
  };


  var addCityForecast = function (data) {
    forecasts = [];
  
    let location = {};

    

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



  var fetchForecast = function (city) {
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=fd29eda782d2ed239fe8bc7bac217402&units=imperial`,
      dataType: 'json',
      success: function (data) {
        addCityForecast(data);
  
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

      var source = $('#weather-icon-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(location);
      $('.cities').append(newHTML);

      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(location);
      $('.forecasts').append(newHTML);

    }
    clearSearch();
  };
  
  renderCity();