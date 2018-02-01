const immutable = require('immutable');
const mergeDeep = require('./_utils');

const names = ['common', 'scss', 'jsx'];

module.exports = opts => {
    //var configMap = new immutable.Map();
    var configs = {};

    // собираем все отдельые конфиги в один
    names.forEach(cfg => {
        var config = require(`./pieces/${cfg}`)(opts);

        mergeDeep(configs, config);
    });

    return configs;
}