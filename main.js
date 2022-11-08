$("#search-button").click(function (e) {
  let query = $("#search-query").val();

  e.preventDefault();
  $("#search-query").val('');
  
  if (query) {
    $(".five-day").removeClass("visually-hidden");

    fetchCoordinates(query);
  }
});

$(".current-location").click(function () {
  $(".five-day").removeClass("visually-hidden");
 
  navigator.geolocation.getCurrentPosition(function (pos) {
    let crds = pos.coords;
    let lat = crds.latitude;
    let lon = crds.longitude;

    fetchCurrent(lat, lon);
    fetch5Day(lat, lon);
    getImageData(lat, lon, 32);
  });
});
