function renderCurrentWeather(data) {
  $(".current").empty();

  let source = $("#current-template").html();
  let template = Handlebars.compile(source);
  let html = template(data);

  $(".current").append(html);
}

function render5DayWeather(data) {
  $(".five-day").empty();

  let source = $("#five-day-template").html();
  let template = Handlebars.compile(source);

  data.forEach((day) => {
    let html = template(day);

    $(".five-day").append(html);
  });
}

function renderError() {
  $(".current").empty();
  $(".five-day").empty();

  $(".current").append(
    '<p class="error">There was an error, please try another search query.</p>'
  );
}

function renderImageLeft(serverId, photoId, secret, size = "") {
  let imageOrigin = "https://live.staticflickr.com/";
  let url =
    imageOrigin + serverId + "/" + photoId + "_" + secret + size + ".jpg";
  $(".left-of-search").empty();
  $(".left-of-search").append('<img src="' + url + '"/>');
}

function renderImageRight(serverId, photoId, secret, size = "") {
  let imageOrigin = "https://live.staticflickr.com/";
  let url =
    imageOrigin + serverId + "/" + photoId + "_" + secret + size + ".jpg";
  $(".right-of-search").empty();
  $(".right-of-search").append('<img src="' + url + '"/>');
}
