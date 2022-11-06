let origin = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search'
let flickrApiKey = '&api_key=b88d4fdc7608eee8dcd3711038d3d22b'
let tag = '&tags=mountains'
let extraParams = '&radius=25&per_page=5&page=1&tags=scenic&format=json&nojsoncallback=1'

function getImageData(i, lat, lon, radius) {
  let searchParams = origin + flickrApiKey + "&lat=" + lat + '&lon=' + lon + '&radius=' + radius + extraParams
  $.get(searchParams, function (data) {
    let photos = data.photos.photo
    let serverId = photos[i].server;
    let photoId = photos[i].id;
    let secret = photos[i].secret;
    
    getImageUrl(serverId, photoId, secret, "_q");
  })
}

function getImageUrl (serverId, photoId, secret, size = '') {
  let imageOrigin = 'https://live.staticflickr.com/'
  let url = imageOrigin + serverId + '/' + photoId + '_' + secret + size+ '.jpg';
  renderImage(url);
}

function renderImage(url) {
  console.log(url);
  $('.intro-info').empty();
  $('.intro-info').append('<img src="' + url + '"/>')
}
