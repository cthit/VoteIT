jest.autoMockOff();

require("../src/utils");

var CodeManager = require("../src/codeManager");

describe("CodeManager", function() {
    describe("nextSession", function() {
        it("should not be initialized to a valid value", function() {
            var cm = new CodeManager();
            expect(cm.currentSession).not.toBeGreaterThan(-1);
        });

        it("should throw when nextSession is called before generated codes", function() {
            var cm = new CodeManager();
            expect(function() {
                cm.nextSession();
            }).toThrow("No codes generated");
        });

        it("should throw when nextSession is called before generated codes", function() {
            var cm = new CodeManager();
            cm.generateCodes(2, 1, 10);

            var objBefore = Object.clone(cm);

            expect(function() {
                cm.nextSession();
            }).not.toThrow();

            expect(function() {
                cm.nextSession();
            }).toThrow("Out of generated codes");

            var objAfter = Object.clone(cm);

            expect(objBefore).toEqual(objAfter);
        });

        it("should get a valid value when nextSession is called correctly", function() {
            var cm = new CodeManager();
            cm.generateCodes(2, 5, 10);
            cm.nextSession();

            expect(cm.currentSession).toBe(0);
        });
    });

    describe("invalidateCode", function() {
        it("should return false if code is not in list", function() {
            var cm = new CodeManager();
            var validCodes = cm.generateCodes(2, 5, 10)[0];

            cm.nextSession();

            var codeNotInArray = 'codeNotInArray';

            expect(validCodes.indexOf(codeNotInArray)).toBe(-1);
            expect(cm.isValidCode(cm)).toBe(false);
            expect(cm.invalidateCode(codeNotInArray)).toBe(false);
        });

        it("should invalidate code", function() {
            var cm = new CodeManager();
            var validCodes = cm.generateCodes(2, 5, 10)[0];

            cm.nextSession();

            var beforeObj = Object.clone(cm);

            var firstCode = validCodes[0];

            expect(cm.isValidCode(firstCode)).toBe(true);

            var result = cm.invalidateCode(firstCode);

            expect(result).toBe(true);
            expect(cm.isValidCode(firstCode)).toBe(false);

            var afterObj = Object.clone(cm);

            beforeObj.codes[0] = validCodes.filter(function(c) {
                return c !== firstCode;
            });

            expect(beforeObj).toEqual(afterObj);
        });
    });
});


