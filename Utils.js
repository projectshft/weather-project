const Collection = (config) => {
    const models = []

    const init = () => {
        if (config) {
            models.push(config)
        }
    };

    let changeCallback = null;

    const add = (day) => {
        if (!_.includes(models, day) || _.isEmpty(models)) {
            models.push(item);

            if (changeCallback) {
                changeCallback();
            }
        }
    };

    const change = (fx) => changeCallback = fx;

    init();

    return {
        models,
        add,
        change
    }
};

const Model = (config) => {
    let attributes = {}

    let changeCallback = null

    const init = () => Object.assign(attributes,config)

    const set = (prop, value) => {
        let tempObj = Object.assign({}, attributes)

        tempObj[prop] = value

        if (!_.isEqual(attributes, tempObj)) {
            attributes[prop] = value

            if (changeCallback) {
                changeCallback();
            }
        }
    };

    const getAttributes = () => attributes;
    const get = (prop) => attributes[prop];
    const change = (fx) => changeCallback = fx;

    return {
        set,
        getAttributes,
        get,
        change
    }
};

const View = (model, template) => {
    const render = () => {
        let attrs = model.getAttributes();

        return template(attrs);
    };

    return {
        render
    };
};