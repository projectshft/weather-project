let apiKey = process.env.API_KEY
console.log(apiKey)


$('.search').on('click', function(){
  let search = $('#search-query').val()
  fetchLocation(search)
})

let fetchLocation = function(query){
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${API_KEY}`,
    dataType: "json",
    success: function(data){
      // console.log(data)
      let latitude = data[0].lat
      let longitude = data[0].lon
      // console.log(latitude, longitude)
      fetchWeather(latitude, longitude)
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
  
}
let fetchWeather = function(lat,lon){
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    dataType: 'json',
    success: function(data){
      console.log(data)
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
}