var Random = require("random-js"); // uses the nativeMath engine
var randomjs = Random(Random.engines.browserCrypto);

var BASE58CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';

function generateCodes(nbrOfUsers, nbrOfCodesPerUser, lengthOfCodes) {
    var codes = [];
    for (var i = 0; i < nbrOfCodesPerUser; i++) {
        var oneSessionCodes = [];
        for (var j = 0; j < nbrOfUsers; j++) {
            var code;
            do {
                code = randomjs.string(lengthOfCodes, BASE58CHARS);
            } while (oneSessionCodes.indexOf(code) !== -1);
            oneSessionCodes.push(code);
        }
        codes.push(oneSessionCodes);
    }
    return codes;
}

function randomToken(length) {
    return randomjs.string(length);
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
    generateCodes: generateCodes,
    randomToken: randomToken
};
