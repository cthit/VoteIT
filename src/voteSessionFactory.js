function createVoteSession(candidateNames, vacantEnabled, maxCandidates) {
    if (!candidateNames || candidateNames.length === 0) {
        throw "No candidates defined";
    }

    if (maxCandidates <= 0 || isNaN(maxCandidates)) {
        throw "Max selections per vote must be greater than 0";
    }

    var candidates = candidateNames.map(function (value, index) {
        return {
            id: index,
            name: value,
            vacant: false,
        };
    });

    var vacantCandidates = [];
    if (vacantEnabled) {
        for (var i = 0; i < maxCandidates; i++) {
            var index = candidates.length + i;
            vacantCandidates.push({
                id: index,
                name: "Vakant" + (i + 1),
                vacant: true,
            });
        }
    }

    return {
        options: candidates,
        vacantOptions: vacantCandidates,
        maximumNbrOfVotes: maxCandidates,
        winners: [],
    };
}

module.exports = {
    createVoteSession: createVoteSession,
};
