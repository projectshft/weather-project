const Collection = (config) => {
  const models = []

  const init = () => {
    if (Array.isArray(config)) {
      config.forEach(function (m) {
        models.push(m);
      });
    }
  }

  let changeCallback = null

  const add = (item) => {
    if (!_.includes(models, item) || _.isEmpty(models)) {
      models.push(item);

      if (changeCallback) {
        changeCallback()
      }
    }
  }

  const remove = (item) => {
    if (typeof item === "object") {
      models.forEach(function (m, i) {
        for (prop in item) {
          if (item[prop] === m.get(prop)) {
            debugger;

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

  const change = (func) => changeCallback = func;

  init();

  return {
    add,
    models,
    change,
    remove
  }
};

const Model = (config) => {
  const attributes = {}

  let changeCallback = null

  const init = () => Object.assign(attributes, config)

  const set = (prop, value) => {
    const tempObj = Object.assign({}, attributes)

    tempObj[prop] = value

    if (!_.isEqual(attributes, tempObj)) {
      attributes[prop] = value

      if (changeCallback) {
        changeCallback()
      }
    }
  };

  const getAttributes = () => attributes;

  const get = (prop) => attributes[prop]
  const change = (func) => changeCallback = func;

  init()

  return {
    set,
    get,
    change,
    getAttributes
  }
};

const View = (model, template) => {
  const render = function() {
    var attrs = model.getAttributes();

    return template(attrs);
  };

  return {
    render
  };
};
