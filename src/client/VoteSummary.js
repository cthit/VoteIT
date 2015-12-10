var React = require('react');

var VoteSummary = ({ candidates, numVotesLeft, vacants }) => {

    let cands = candidates.filter(cand => cand.active).map(cand => cand.name);
    let numVacants = vacants.filter(vac => vac.active).length;

    return (
        <div className="vote-summary">
            <div className="header">
                <h1>Vote summary</h1>
            </div>
            <div className="body">
                <div>{cands.length > 0 && (<span>You are voting for {cands.join(', ')}.</span>)}</div>
                <div>{numVacants > 0 && (<span>You are voting to leave {numVacants} {numVacants > 1 ? 'positions' : 'position'} vacant.</span>)}</div>
                <div>{numVotesLeft > 0 && (<span>{numVotesLeft} blank {numVotesLeft > 1 ? 'votes' : 'vote' }.</span>)}</div>
            </div>
        </div>
    );
};



module.exports = VoteSummary;
