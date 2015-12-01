var React = require('react');

var Candidate = require('./Candidate');


var CandidateList = React.createClass({
    handleCandidateClicked(id) {
        this.props.candidateClicked(id);
    },
    render() {
        let { candidates, numVotesLeft, lowestVacantIndex } = this.props;
        return (
            <div className="candidate-list">
                {this.props.candidates.map((candidate) =>
                    (<Candidate key={candidate.id}
                                candidate={candidate}
                                disabled={(!candidate.active && numVotesLeft < 1) || (candidate.vacant && candidate.id > lowestVacantIndex)}
                                checked={candidate.active}
                                onClick={this.handleCandidateClicked}/>)
                )}
            </div>
        );
    }
});


module.exports = CandidateList;
