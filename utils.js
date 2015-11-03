var Random = require("random-js"); // uses the nativeMath engine
Random = Random(Random.engines.mt19937().autoSeed());

var BASE58CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function generateCodes(nbrOfUsers, nbrOfCodesPerUser, lengthOfCodes) {
    var codes = [];
    for (var i = 0; i < nbrOfUsers; i++) {
        var oneUserCodes = [];
        for (var j = 0; j < nbrOfCodesPerUser; j++) {
            oneUserCodes.push(randomString(lengthOfCodes, BASE58CHARS));
        }
        codes.push(oneUserCodes);
    }
    return codes;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Random.integer(0, chars.length - 1)];
    }
    return result;
}

Array.prototype.reject = function(func) {
    return this.filter(function(item) {
        return !func(item);
    });
};


Array.prototype.shuffle = function() {
    Random.shuffle(this);
    return this;
};


module.exports = {
    generateCodes: generateCodes
};
