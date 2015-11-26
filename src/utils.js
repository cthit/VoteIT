var Random = require("random-js"); // uses the nativeMath engine
var randomjs = Random(Random.engines.mt19937().autoSeed());

var BASE58CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function generateCodes(nbrOfUsers, nbrOfCodesPerUser, lengthOfCodes) {
    var codes = [];
    for (var i = 0; i < nbrOfCodesPerUser; i++) {
        var oneSessionCodes = [];
        for (var j = 0; j < nbrOfUsers; j++) {
            var code;
            do {
                code = randomString(lengthOfCodes, BASE58CHARS);
            } while (oneSessionCodes.indexOf(code) !== -1);
            oneSessionCodes.push(code);
        }
        codes.push(oneSessionCodes);
    }
    return codes;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[randomjs.integer(0, chars.length - 1)];
    }
    return result;
}

Array.prototype.reject = function(func) {
    return this.filter(function(item) {
        return !func(item);
    });
};

Object.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};


Array.prototype.shuffle = function() {
    randomjs.shuffle(this);
    return this;
};

Array.prototype.transpose = function() {
    var that = this;
    return Object.keys(this[0]).map(function(c) {
        return that.map(function(r) {
            return r[c];
        });
    });
};


module.exports = {
    generateCodes: generateCodes
};
