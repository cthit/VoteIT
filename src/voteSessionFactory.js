function createVoteSession(candidateNames, vacantEnabled, maxCandidates, maxTimeInSeconds) {
    var candidates = candidateNames.map(function(value, index) {
        return {
            id: index,
            name: value,
            vacant: false
        };
    });

    var vacantCandidates = [];
    if (vacantEnabled) {
        for (var i = 0; i < maxCandidates; i++) {
            var index = candidates.length + i;
            vacantCandidates.push({
                id: index,
                name: "Vakant" + (i + 1),
                vacant: true
            });
        }
    }

    return {
        timeLeft: maxTimeInSeconds,
        options: candidates,
        vacantOptions: vacantCandidates,
        maximumNbrOfVotes: maxCandidates,
        winners: []
    };
}


module.exports = {
    createVoteSession: createVoteSession
};
