function omit(obj, omitKeyArr) {
    let data = {}
    omitKeyArr.forEach(function(item) {
        
        Object.keys(obj).forEach(function(key) {
            if(item === key) {
                delete obj[key]
            }
        });
    });
    return obj
}

function toProperCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

module.exports = {omit, toProperCase};