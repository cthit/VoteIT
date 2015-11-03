jest.dontMock('../voteManager');

var VoteManager = require('../voteManager');

describe('voteManager', function() {

    describe('createEmptyVoteResults', function() {
        var candidates1 = [{index: 1}, {index: 2}, {index: 3}];
        var candidates2 = [{index: 4}, {index: 5}, {index: 6}];
        var votesCount = new VoteManager(candidates1, candidates2).voteCount;

        it('should create a list with the length of the sum of the lengths passed in', function() {
            expect(Object.keys(votesCount).length).toBe(candidates1.length + candidates2.length);
        });

        it('should create a list where every value is 0', function() {
            Object.keys(votesCount).forEach(function(key) {
                expect(votesCount[key].value).toBe(0);
            });
        });
    });

});
