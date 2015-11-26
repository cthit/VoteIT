var React = require('react');

var Candidate = require('./Candidate');


var CandidateList = React.createClass({
    handleCandidateClicked(id) {
        this.props.candidateClicked(id);
    },
    render() {
        return (
            <div className="candidate-list">
                {this.props.candidates.map((candidate) =>
                    (<Candidate key={candidate.id} candidate={candidate} onClick={this.handleCandidateClicked}/>)
                )}
            </div>
        );
    }
});


module.exports = CandidateList;