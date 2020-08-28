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

};

const View = (model, template) => {

};