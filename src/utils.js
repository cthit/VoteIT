Array.prototype.reject = function (func) {
    return this.filter(function (item) {
        return !func(item);
    });
};

Object.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

//https://stackoverflow.com/a/12646864
Array.prototype.shuffle = function () {
    const copy = [...this];
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }
    return copy;
};

Array.prototype.transpose = function () {
    var that = this;
    return Object.keys(this[0]).map(function (c) {
        return that.map(function (r) {
            return r[c];
        });
    });
};
