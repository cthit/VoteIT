function VoteManager(candidates, vacantCandidates, maximumNbrOfVotes, sessionNbr) {
    this.voteCount = createEmptyVoteResults(candidates, vacantCandidates);
    this.maximumNbrOfVotes = maximumNbrOfVotes;
    this.sessionNbr = sessionNbr;
    this.isOpen = true;
}

VoteManager.prototype.closeVotingSession = function() {
    this.isOpen = false;
    return this.voteCount;
};

function createEmptyVoteResults(candidates, vacantCandidates) {
    var votesCount = {};
    candidates.concat(vacantCandidates).forEach(function(option) {
        votesCount[option.index] = {
            value: 0,
            item: option
        };
    });
    return votesCount;
}

VoteManager.prototype.castVote = function(vote, code, validCodes) {
    var that = this;
    if (this.voteIsValid(vote)) {
        vote.forEach(function(index) {
            that.increaseVoteForOption(index - 1);
        });
        return removeUsedCode(code, validCodes, this.sessionNbr);
    } else {
        return validCodes;
    }
};

VoteManager.prototype.voteIsValid = function(vote) {
    if (!this.isOpen) {
        throw 'Voting is closed';
    }
    if (!this.isValidAmountOfVotes(vote)) {
        throw 'Invalid amount of votes';
    }
    if (!this.checkIfAllOptionsAreValid(vote)) {
        throw 'Invalid option voted for';
    }
    return true;
};

VoteManager.prototype.isValidAmountOfVotes = function(vote) {
    return vote.length <= this.maximumNbrOfVotes
};

VoteManager.prototype.checkIfAllOptionsAreValid = function(vote) {
    return vote.every(function(v) {
        return this.votesCount[v] !== undefined;
    });
};

VoteManager.prototype.increaseVoteForOption = function(optionIndex) {
    this.votesCount[optionIndex].value++;
};

function removeUsedCode(code, codes, sessionNumber) {
    return codes.reject(function(c) {
        return c[sessionNumber] == code;
    });
}

module.exports = VoteManager;
