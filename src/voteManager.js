function VoteManager(
    candidates,
    vacantCandidates,
    maximumNbrOfVotes,
    electionName
) {
    this.voteCount = createEmptyVoteResults(candidates, vacantCandidates);
    this.maximumNbrOfVotes = maximumNbrOfVotes;
    this.isOpen = true;
    this.numberOfVotes = 0;
    this.rawVotes = [];
    this.usersVoted = [];
    this.electionName = electionName;
}

VoteManager.prototype.closeVotingSession = function () {
    this.isOpen = false;
    var that = this;

    return Object.keys(that.voteCount).map(function (k) {
        return that.voteCount[k];
    });
};

function createEmptyVoteResults(candidates, vacantCandidates) {
    var voteCount = {};
    candidates.concat(vacantCandidates).forEach(function (candidate) {
        voteCount[candidate.id] = {
            value: 0,
            item: candidate,
        };
    });
    return voteCount;
}

VoteManager.prototype.getTotalVoteCount = function () {
    return this.numberOfVotes;
};

VoteManager.prototype.getRawVotes = function () {
    return this.rawVotes;
};

VoteManager.prototype.castVote = function (vote, userId) {
    var that = this;
    this.validateVote(vote, userId);

    this.numberOfVotes++;
    this.rawVotes.push(vote);
    this.usersVoted.push(userId);

    vote.forEach(function (key) {
        that.increaseVoteForCandidate(key);
    });
};

VoteManager.prototype.validateVote = function (vote, userId) {
    if (!this.isOpen) {
        throw "Voting is closed";
    }
    if (!this.isValidAmountOfVotes(vote)) {
        throw "Invalid amount of votes";
    }
    if (!this.allVotesUnique(vote)) {
        throw "Duplicate votes";
    }
    if (!this.checkIfAllCandidatesInVoteAreValid(vote)) {
        throw "Invalid option voted for";
    }
    if (this.hasUserVoted(userId)) {
        throw "User already voted";
    }
};

VoteManager.prototype.isValidAmountOfVotes = function (vote) {
    return vote.length <= this.maximumNbrOfVotes;
};

VoteManager.prototype.allVotesUnique = function (vote) {
    var unique = vote.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });

    return vote.length === unique.length;
};

VoteManager.prototype.checkIfAllCandidatesInVoteAreValid = function (vote) {
    var that = this;

    return (
        isVacantVotesInIncreasingIndex(vote, this.voteCount) &&
        vote.every(function (v) {
            return that.voteCount[v] !== undefined;
        })
    );
};

VoteManager.prototype.hasUserVoted = function (userId) {
    return this.usersVoted.includes(userId);
};

function isVacantVotesInIncreasingIndex(vote, voteCount) {
    var vacantIndexes = Object.keys(voteCount)
        .filter(function (key) {
            return voteCount[key].item.vacant === true;
        })
        .map(function (key) {
            return voteCount[key].item.id;
        })
        .sort();

    var currIndex;
    while ((currIndex = vacantIndexes.pop())) {
        if (vote.indexOf(currIndex) !== -1) {
            var test = vacantIndexes
                .filter(function (i) {
                    return i < currIndex;
                })
                .every(function (li) {
                    return vote.indexOf(li) !== -1;
                });
            if (!test) {
                return false;
            }
        }
    }
    return true;
}

VoteManager.prototype.increaseVoteForCandidate = function (candidateIndex) {
    this.voteCount[candidateIndex].value++;
};

module.exports = VoteManager;
