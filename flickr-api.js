let origin =
  "https://api.flickr.com/services/rest/?&method=flickr.photos.search";
let flickrApiKey = "&api_key=b88d4fdc7608eee8dcd3711038d3d22b";
let tag = "&tags=mountains";
let extraParams =
  "&radius=25&per_page=5&page=1&tags=scenic&format=json&nojsoncallback=1";

function getImageData(lat, lon, radius) {
  let searchParams =
    origin +
    flickrApiKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon +
    "&radius=" +
    radius +
    extraParams;

  $.get(searchParams, function (data) {
    let photos = data.photos.photo;
    
    let serverId = photos[0].server;
    let serverId2 = photos[1].server;

    let photoId = photos[0].id;
    let photoId2 = photos[1].id;

    let secret = photos[0].secret;
    let secret2 = photos[1].secret;

    renderImageLeft(serverId, photoId, secret, "_q");
    renderImageRight(serverId2, photoId2, secret2, "_q");
  });
}

function getImageUrl(serverId, photoId, secret, size = "") {
  let imageOrigin = "https://live.staticflickr.com/";
  let url =
    imageOrigin + serverId + "/" + photoId + "_" + secret + size + ".jpg";
  renderImage(url);
}

