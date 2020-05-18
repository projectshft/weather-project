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

// Consulted documentation for use of Object.getOwnPropertyNames
var getMax = function(arr) {

  var obj = getCount(arr);
  var objKeys = Object.getOwnPropertyNames(obj);

  var max = obj[objKeys[0]];
  var maxItem = '';
  counter = 0;

  for (var prop in obj) {
    if (obj[prop] >= max) {
      max = obj[prop];
      maxItem = objKeys[counter];
    }
    counter++;
  }

  return maxItem;
}
