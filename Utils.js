const Collection = (config) => {
    let models = [];
    let todayModel = [];

    const init = () => {
        if (config) {
            models.push(config)
        }
    };

    let changeCallback = null;

    const add = (week) => { 
        models.push(week);
        //console.log(models);
        if (changeCallback) {
            changeCallback();
        }
    };

    const add2 = (day) => {
        todayModel.push(day);
        if(changeCallback) {
            changeCallback();
        }
    }
    
    const change = (fx) => changeCallback = fx;

    init();

    return {
        models,
        todayModel,
        add,
        add2,
        change
    }
};

const Model = (config) => {
    let attributes = {}
    let changeCallback = null

    const init = () => Object.assign(attributes, config)

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

    init();

    return {
        set,
        getAttributes,
        get,
        change
    }
};

const View = (model, template) => {
    const render = () => {
        //console.log(model);
        let attrs = model.getAttributes();

        return template(attrs);
    };

    return {
        render
    };
};