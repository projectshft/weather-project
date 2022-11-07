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

  let lon = null;
  let lat = null;

  navigator.geolocation.getCurrentPosition(function (pos) {
    let crds = pos.coords;
    lat = crds.latitude;
    lon = crds.longitude;

    fetchCurrent(lat, lon);
    fetch5Day(lat, lon);
    getImageData(lat, lon, 30);
  });
});
