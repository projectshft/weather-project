var Collection = function (config) {
  var models = []

  var init = function () {
    if (Array.isArray(config)) {
      config.forEach(function (m) {
        models.push(m)
      })
    }
  }

  var changeCallback = null

  var add = function (item) {
    if (!_.includes(models, item) || _.isEmpty(models)) {
      models.push(item)

      if (changeCallback) {
        changeCallback()
      }
    }
  }

  var remove = function (item) {
    if (typeof item === "object") {
      models.forEach(function (m, i) {
        for (prop in item) {
          if (item[prop] === m.get(prop)) {
            models.splice(i, 1)

            if (changeCallback) {
              changeCallback()
            }
          }
        }
      })
    } else if (typeof item === "number") {
      models.splice(item, 1)

      if (changeCallback) {
        changeCallback()
      }
    } else {
      throw "The argument passed to remove must be an object or number"
    }
  }

  var change = function (func) {
    changeCallback = func;
  }

  init();

  return {
    add: add,
    models: models,
    change: change,
    remove: remove
  }
}

var Model = function (config) {
  var attributes = {}

  var changeCallback = null

  var init = function () {
    Object.assign(attributes, config)
  }

  var set = function (prop, value) {
    var tempObj = Object.assign({}, attributes)

    tempObj[prop] = value

    if (!_.isEqual(attributes, tempObj)) {
      attributes[prop] = value

      if (changeCallback) {
        changeCallback()
      }
    }
  };

  var get = function (prop) {
    return attributes[prop]
  };

  var change = function (func) {
    return changeCallback = func;
  }

  var getAttributes = function () {
    return attributes;
  }

  init()

  return {
    set: set,
    get:get,
    getAttributes: getAttributes,
    change: change
  }
};

var View = function (model, template) {
  var render = function() {
    var attrs = model.getAttributes()

    return template(attrs);
  }

  return {
    render: render
  }
}
