

var fetchNearbyCities = function(query) {
  lastSearch = query
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/find?APPID=617793780ad9ce0ef4274bedce3819d2&cnt=10&lat="+(currentWeather[0].coord.lat)+"&lon="+(currentWeather[0].coord.lon),
    dataType: "json",
    success: function(data) {
      console.log("nearby cities data extracted")

      storeNearbyCities(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};


var storeNearbyCities = function(data) {
  nearbyCities[0] = data
  console.log("nearby cities data stored")
  renderNearbyCities();
};

var renderNearbyCities = function() {
  /*clear view*/
  $('.nearby-cities-list').empty();
  console.log("nearby cities rendering initiated")
  var a = 0
  /* retreive cities from nearbyCities model */
  nearbyCities[0].list.forEach(function(item, index) {
    a++
    let city = item.name;

    console.log("start city: "+index)
    /* Render nearbyCities with Handlebars */
    if(index>0){
      $('<a href="#" class="mr-2 nearby">'+city+'</a>').appendTo($('.nearby-cities-list'));
    }

  })


};
