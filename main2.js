var key = "07b68b6fdc6feb7bf70f5a06e80bc1bd";
var city = "";

$('button').click(function () {
  city = $('#search-query').val();
  $('.city-row').toggle();
  $('.five-row').toggle();
  renderCurrWeath(city);
  renderExtFore(city);
  $('#search-query').val('');
})

var renderCurrWeath = function (query) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?appid="+key+"&q="+city, 
    dataType: "json",
    type: "GET",
    data: {
      units: "imperial"
    },
    success: function(data) {
      //console.log('Received data:', data.weather) 
      var wf = "";
      wf += "<h2>" + city + " current weather <br></h2><br><b>" + day.toLowerCase() + "</b>: "; 
      wf += Math.round(data.main.temp) + " &degF ";
      wf += "<span> | " + data.weather[0].description + "</span>";
      wf += " <img src='https://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>"
      $(".city-row").html(wf);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('please enter a city name');
    }
  });

};

var renderExtFore = function (query) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?appid=" + key + "&q=" + city, 
    dataType: "json",
    type: "GET",
    data: {
      units: "imperial",
      cnt: "5"
    },
    success: function(data) {
      console.log('Received data:', data)
      var xwf = "";
      xwf += "<h2>" + city + " extended forecast</h2>"; 
      //console.log(data.list[0].dt_txt);
      $.each(data.list, function(index, val) {
        timestamp = val.dt
        var a = new Date(timestamp*1000);
        var dayOfWeek = days[a.getDay()]
        xwf += "<p>" 
        xwf += "<b> " + dayOfWeek.toLowerCase() + "</b>: " 
        xwf += Math.round(val.main.temp) + "&degF" 
        xwf += "<span> | " + val.weather[0].description + "</span>"; 
        xwf += "<img src='https://openweathermap.org/img/w/" + val.weather[0].icon + ".png'>" 
        xwf += "</p>" 
      });
      $(".five-row").html(xwf);
    }
  });

};

var now = new Date();
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var day = days[ now.getDay() ];
var timestamp = null;
