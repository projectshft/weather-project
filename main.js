var testObj = fetch('http://api.openweathermap.org/geo/1.0/direct?q=Hanford&limit=1&appid=f7b75cc3d00a79fd79ccdda543f26f00');

console.log(testObj);
console.log(testObj.then(function () {
  console.log('Done!');
}));

