jest.autoMockOff();

var VoteCounter = require("../voteCounter");

describe('voteCounter', function() {
    describe('moveFromArrayUntilLength', function() {

        it('should move the elements from a1 to a2', function() {
            var arr1 = [3, 4, 6, 7, 8, 9];
            var arr2 = [1, 2];

            VoteCounter.moveFromArrayUntilLength(arr1, arr2, 5);
            expect(arr1.length).toBe(3);
            expect(arr2.length).toBe(5);

            expect(arr1).toEqual([7, 8, 9]);
            expect(arr2).toEqual([1, 2, 3, 4, 6]);
        });

        it('should throw with a shorter list than length', function() {
            var arr1 = [3, 4];
            var arr2 = [1, 2];
            var lengthGreaterThanAllowed = 5;

            expect(function() {
                VoteCounter.moveFromArrayUntilLength(arr1, arr2, lengthGreaterThanAllowed);
            }).toThrow('fromArray too short');
        });
    });

    describe('pickWinnersWhenSameVoteCount', function() {
        var candidates = [{
            name: 'Ada',
            vacant: false
        }, {
            name: 'Haskell',
            vacant: false
        }, {
            name: 'Erlang',
            vacant: false
        }, {
            name: 'Vakant1',
            vacant: true
        }, {
            name: 'Vakant2',
            vacant: true
        }];

        function validateCandidates(expectedNames, candidates, count) {
            var candidatesLength = expectedNames.length;

            candidates.forEach(function(cand) {
                expect(expectedNames).toContain(cand.name);
                expectedNames = expectedNames.filter(function(name) {
                    return name !== cand.name;
                });
                expect(expectedNames).not.toContain(cand.name);
            });
            expect(expectedNames.length).toBe(candidatesLength - count);

        }

        function chooseWinnersRepeatedly(count, iterations) {
            var winnerConstallations = [];
            for (var i = 0; i < iterations; i++) {
                winnerConstallations.push(VoteCounter.pickWinnersWhenSameVoteCount(candidates, count));
            }
            return winnerConstallations;
        }

        function equalName(o1, o2) {
            return o1.name === o2.name;
        }

        function equalCandidateList(l1, l2) {
            if (l1.length === l2.length) {
                for (var i = 0; i < l1.length; i++) {
                    if (!equalName(l1[i], l2[i])) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        it('should shuffle candidates when numWinners less than numCandidates', function() {
            var iterations = 20;
            var winnerConstallations = chooseWinnersRepeatedly(2, iterations);
            var test = true;
            for (var i = 0; i < winnerConstallations.length - 1; i++) {
                test = test && equalCandidateList(winnerConstallations[i], winnerConstallations[i + 1]);
            }
            expect(test).toBe(false);
        });

        it('should only choose non-vacants when choosing a number less than candidates count', function() {

            function expectAllCandidates(count) {
                var winners = VoteCounter.pickWinnersWhenSameVoteCount(candidates, count);

                expect(winners.length).toBe(count);
                winners.forEach(function(winner) {
                    expect(winner.vacant).toBe(false);
                });

                var candidateNames = ['Ada', 'Haskell', 'Erlang'];

                validateCandidates(candidateNames, winners, count);
            }

            expectAllCandidates(1);
            expectAllCandidates(2);
            expectAllCandidates(3);
        });

        it('should fill in vacants if greater than candidates count', function() {
            var winnersCount = 4;
            var winners = VoteCounter.pickWinnersWhenSameVoteCount(candidates, winnersCount);

            expect(winners.length).toBe(winnersCount);
            var cands = 0;
            var vacants = 0;
            winners.forEach(function(winner) {
                if (winner.vacant) {
                    vacants++;
                } else {
                    cands++;
                }
            });
            expect(cands).toBe(3);
            expect(vacants).toBe(1);

            var candidateNames = ['Ada', 'Haskell', 'Erlang', 'Vakant1'];

            validateCandidates(candidateNames, winners, winnersCount);
        });
    });

    describe('groupByVoteValue', function() {
        var votesCount = [
            {value: 4, item: 'cand1'},
            {value: 4, item: 'cand2'},
            {value: 4, item: 'cand3'},
            {value: 3, item: 'cand6'},
            {value: 3, item: 'cand7'},
            {value: 2, item: 'cand4'},
            {value: 1, item: 'cand5'}
        ];
        it('should group correctly by value', function() {
            var grouped = VoteCounter.groupByVoteValue(votesCount);

            expect(grouped[1].sort()).toEqual(['cand5']);
            expect(grouped[2].sort()).toEqual(['cand4']);
            expect(grouped[3].sort()).toEqual(['cand6', 'cand7']);
            expect(grouped[4].sort()).toEqual(['cand1', 'cand2', 'cand3']);
            expect(Object.keys(grouped).length).toBe(4);
        });
    });

    describe('countVotes', function() {

        it('should pick the two candidates with most votes', function() {
            var votesCount = [
                {value: 4, item: {name: 'cand1', vacant: false}},
                {value: 4, item: {name: 'cand2', vacant: false}},
                {value: 3, item: {name: 'cand3', vacant: false}},
                {value: 3, item: {name: 'cand7', vacant: false}},
                {value: 3, item: {name: 'vakant1', vacant: true}},
                {value: 2, item: {name: 'cand4', vacant: false}},
                {value: 1, item: {name: 'vakant2', vacant: true}}
            ];

            var spots = 2;
            var winners = VoteCounter.countVotes(votesCount, spots);

            expect(winners.length).toBe(spots);

            expect(winners.map(function(winner) {
                return winner.name;
            }).sort()).toEqual(['cand1', 'cand2']);
        });

        it('should pick the three candidates with most votes', function() {
            var votesCount = [
                {value: 4, item: {name: 'cand1', vacant: false}},
                {value: 4, item: {name: 'cand2', vacant: false}},
                {value: 3, item: {name: 'cand3', vacant: false}},
                {value: 3, item: {name: 'cand7', vacant: false}},
                {value: 3, item: {name: 'vakant1', vacant: true}},
                {value: 2, item: {name: 'cand4', vacant: false}},
                {value: 1, item: {name: 'vakant2', vacant: true}},
                {value: 1, item: {name: 'vakant3', vacant: true}}
            ];

            var spots = 3;
            var winners = VoteCounter.countVotes(votesCount, spots);

            expect(winners.length).toBe(spots);

            var sortedWinners = winners.map(function(winner) {
                return winner.name;
            }).sort();

            expect(sortedWinners[0]).toEqual('cand1');
            expect(sortedWinners[1]).toEqual('cand2');
            expect(['cand3', 'cand7']).toContain(sortedWinners[2]);
        });

        it('should pick the six candidates with most votes', function() {
            var votesCount = [
                {value: 4, item: {name: 'cand1', vacant: false}},
                {value: 4, item: {name: 'cand2', vacant: false}},
                {value: 3, item: {name: 'cand3', vacant: false}},
                {value: 3, item: {name: 'cand6', vacant: false}},
                {value: 3, item: {name: 'vakant1', vacant: true}},
                {value: 2, item: {name: 'cand4', vacant: false}},
                {value: 1, item: {name: 'cand5', vacant: false}},
                {value: 1, item: {name: 'vakant2', vacant: true}},
                {value: 1, item: {name: 'vakant3', vacant: true}},
                {value: 0, item: {name: 'vakant4', vacant: true}},
                {value: 0, item: {name: 'vakant5', vacant: true}},
                {value: 0, item: {name: 'vakant6', vacant: true}}
            ];

            var spots = 6;
            var winners = VoteCounter.countVotes(votesCount, spots);

            expect(winners.length).toBe(spots);

            var sortedWinners = winners.map(function(winner) {
                return winner.name;
            }).sort();

            expect(sortedWinners).toEqual(['cand1', 'cand2', 'cand3', 'cand4', 'cand6', 'vakant1']);
        });

        it('should randomly pick a candidate when multiple have same vote count', function() {
            function repeatedlyChooseCandidate(candidates, spots) {
                var iterations = 20;
                var winnerConstallations = [];
                for (var i = 0; i < iterations; i++) {
                    winnerConstallations.push(VoteCounter.countVotes(candidates, spots));
                }
                return winnerConstallations;

            }
            var votesCount = [
                {value: 4, item: {name: 'cand1', vacant: false}},
                {value: 4, item: {name: 'cand2', vacant: false}},
                {value: 1, item: {name: 'vakant1', vacant: true}}
            ];

            var winners = repeatedlyChooseCandidate(votesCount, 1).map(function(winner) {
                return winner[0].name;
            });

            winners.forEach(function(winner) {
                expect(['cand1', 'cand2']).toContain(winner);
            });

            var test = true;
            for (var i = 0; i < winners.length - 1; i++) {
                test = test && (winners[i] === winners[i + 1]);
            }
            expect(test).toBe(false);
        });
    });
});