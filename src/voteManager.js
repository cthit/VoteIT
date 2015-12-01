require('./utils');

function VoteManager(candidates, vacantCandidates, maximumNbrOfVotes) {
    this.voteCount = createEmptyVoteResults(candidates, vacantCandidates);
    this.maximumNbrOfVotes = maximumNbrOfVotes;
    this.isOpen = true;
}

VoteManager.prototype.closeVotingSession = function() {
    this.isOpen = false;
    var that = this;

    return Object.keys(that.voteCount).map(function(k) {
        return that.voteCount[k];
    });
};

function createEmptyVoteResults(candidates, vacantCandidates) {
    var voteCount = {};
    candidates.concat(vacantCandidates).forEach(function(candidate) {
        voteCount[candidate.id] = {
            value: 0,
            item: candidate
        };
    });
    return voteCount;
}

VoteManager.prototype.castVote = function(vote) {
    var that = this;
    this.validateVote(vote);

    vote.forEach(function(key) {
        that.increaseVoteForCandidate(key);
    });
};

VoteManager.prototype.validateVote = function(vote) {
    if (!this.isOpen) {
        throw 'Voting is closed';
    }
    if (!this.isValidAmountOfVotes(vote)) {
        throw 'Invalid amount of votes';
    }
    if (!this.allVotesUnique(vote)) {
        throw 'Duplicate votes';
    }
    if (!this.checkIfAllCandidatesInVoteAreValid(vote)) {
        throw 'Invalid option voted for';
    }
};

VoteManager.prototype.isValidAmountOfVotes = function(vote) {
    return vote.length <= this.maximumNbrOfVotes;
};

VoteManager.prototype.allVotesUnique = function(vote) {
    var unique = vote.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });

    return vote.length === unique.length;
};

VoteManager.prototype.checkIfAllCandidatesInVoteAreValid = function(vote) {
    var that = this;

    return isVacantVotesInIncreasingIndex(vote, this.voteCount) && vote.every(function(v) {
        return that.voteCount[v] !== undefined;
    });
};

function isVacantVotesInIncreasingIndex(vote, voteCount) {
    var vacantIndexes = Object.keys(voteCount).filter(function(key) {
        return voteCount[key].item.vacant === true;
    }).map(function(key){
        return voteCount[key].item.id;
    }).sort();


    var currIndex;
    while(currIndex = vacantIndexes.pop()) {
        if(vote.indexOf(currIndex) !== -1) {
            var test = vacantIndexes.filter(function(i) {
                return i < currIndex;
            }).every(function(li) {
                return vote.indexOf(li) !== -1;
            });
            if (!test) {
                return false;
            }
        }
    }
    return true;
}

VoteManager.prototype.increaseVoteForCandidate = function(candidateIndex) {
    this.voteCount[candidateIndex].value++;
};

module.exports = VoteManager;
