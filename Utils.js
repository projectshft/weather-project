const Collection = (config) => {
    //Hold models for curent day and week days
    let models = [];
    let todayModel = [];

    const init = () => {
        if (config) {
            models.push(config)
        }
    };

    let changeCallback = null;

    //adds week day models
    const add = (week) => { 
        models.push(week);
        if (changeCallback) {
            changeCallback();
        }
    };

    //adds current day model
    const add2 = (day) => {
        todayModel.push(day);
        if(changeCallback) {
            changeCallback();
        }

    }
    
    const change = (func) => changeCallback = func;

    init();

    return {
        models,
        todayModel,
        add,
        add2,
        change,
        init
    }
};

const Model = (config) => {
    let attributes = {}
    let changeCallback = null

    const init = () => Object.assign(attributes, config)

    //Set properties to models
    const set = (prop, value) => {
        let tempObj = Object.assign({}, attributes)

        tempObj[prop] = value

        //Checks for duplicates and assigns only unique properties
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

//Render models to browser
const View = (model, template) => {
    const render = () => {
        if (model) {
            let attrs = model.getAttributes();

            return template(attrs);
        }
    };
    return {
        render
    };
};