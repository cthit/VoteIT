require('./utils');

function VoteManager(candidates, vacantCandidates, maximumNbrOfVotes) {
    this.voteCount = createEmptyVoteResults(candidates, vacantCandidates);
    this.maximumNbrOfVotes = maximumNbrOfVotes;
    this.isOpen = true;
}

VoteManager.prototype.closeVotingSession = function() {
    this.isOpen = false;
    return this.voteCount;
};

function createEmptyVoteResults(candidates, vacantCandidates) {
    var voteCount = {};
    candidates.concat(vacantCandidates).forEach(function(candidate) {
        voteCount[candidate.index] = {
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
    return vote.every(function(v) {
        return that.voteCount[v] !== undefined;
    });
};

VoteManager.prototype.increaseVoteForCandidate = function(candidateIndex) {
    this.voteCount[candidateIndex].value++;
};

module.exports = VoteManager;
