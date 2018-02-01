function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function isArray(item) {
    return Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
module.exports = function mergeDeep(target, source) {
    if (isObject(target) && isObject(source)) {
        for (var key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }

            if (isObject(source[key])) {
                if (!target[key]) {
                    target[key] = Object.assign({}, source[key]);
                } else {
                    mergeDeep(target[key], source[key]);
                }
            } else if (isArray(source[key]) && (isArray(target[key]) || !target[key])) {
                target[key] = (target[key] || []).concat(source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return target;
}