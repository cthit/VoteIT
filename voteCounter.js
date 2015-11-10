require('./utils');

function countVotes(votesCount, maximumNbrOfVotes) {
    var groupedOptions = groupByVoteValue(votesCount);

    var keys = Object.keys(groupedOptions).sort();
    var winners = [];

    while(maximumNbrOfVotes - winners.length > 0){
        var key = keys.pop();
        var spots = maximumNbrOfVotes - winners.length;
        winners = winners.concat(concatWithCandidates(groupedOptions[key], spots));
    }

    return winners;
}

function groupByVoteValue(votesCount) {
    return votesCount.reduce(function(acc, curr) {
        acc[curr.value] = acc[curr.value] || [];
        acc[curr.value].push(curr.item);
        return acc;
    }, {});
}

function concatWithCandidates(candidates, spots) {
    if (candidates.length <= spots) {
        return candidates;
    } else {
        return pickWinnersWhenSameVoteCount(candidates, spots);
    }
}

function pickWinnersWhenSameVoteCount(candidates, spots) {
    var winners = [];
    var candidatesExceptVacant = candidates.reject(isVacant);

    if (spots >= candidatesExceptVacant.length) {
        winners = winners.concat(candidatesExceptVacant);
        var vacantCandidates = candidates.filter(isVacant);
        moveFromArrayUntilLength(vacantCandidates, winners, spots);
    } else {
        candidatesExceptVacant.shuffle();
        moveFromArrayUntilLength(candidatesExceptVacant, winners, spots);
    }

    return winners;
}

function moveFromArrayUntilLength(fromArray, toArray, length) {
    if (length - toArray.length > fromArray.length) {
        throw "fromArray too short";
    }

    while (length - toArray.length > 0) {
        toArray.push(fromArray.shift());
    }
}

function isVacant(item) {
    return Boolean(item.vacant);
}

module.exports = {
    countVotes: countVotes,
    groupByVoteValue: groupByVoteValue,
    moveFromArrayUntilLength: moveFromArrayUntilLength,
    pickWinnersWhenSameVoteCount: pickWinnersWhenSameVoteCount
};
