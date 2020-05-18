
// Modified from my solutions to the Project Shift code challenge

var getCount = function (arr) {
  var countedItems = arr.reduce(function (total, currentInstance) {
    if (currentInstance in total) {
      total[currentInstance]++
    }
    else {
      total[currentInstance] = 1
    }
    return total
    }, {});

    return countedItems;
}

var getMax = function(arr) {

  var obj = getCount(arr);
  var objKeys = Object.getOwnPropertyNames(obj);

  var max = obj[objKeys[0]];
  var maxItem = '';
  counter = 0;

  // In case of a tie, the last shall be first ...
  for (var prop in obj) {
    if (obj[prop] >= max) {
      max = obj[prop];
      maxItem = objKeys[counter];
    }
    counter++;
  }

  return maxItem;
}
