var React = require('react');

var Button = require('./Button');
var CodeInput = require('./CodeInput');
var CandidateList = require('./CandidateList');

var server = require('./backend');

var User = React.createClass({
    getInitialState() {
        return {
            sessionNumber: 0,
            isOpen: false,
            candidates: [],
            vacants: []
        }
    },
    componentWillMount() {
        fetch('/status').then(res => res.json()).then(status => {
           this.setState({
               sessionNumber: status.sessionNumber,
               isOpen: status.votingOpened,
               candidates: status.candidates || [],
               vacants: status.vacants || [],
               codeLength: status.codeLength || 0
           })
        });
    },
    handleCandidateClicked(id) {
        var candidates = this.state.candidates.map((cand) => {
            if (cand.id === id) {
                return {
                    id: cand.id,
                    name: cand.name,
                    vacant: cand.vacant,
                    active: !cand.active
                };
            } else {
                return cand;
            }
        });

        this.setState({
            candidates
        });
    },
    handleVoteSubmit() {
        let code = this.codeFields.getCode();

        let vote = this.state.candidates.filter(c => c.active).map(c => c.id);

        server.postJSON('/vote', { code, vote })
            .then((res) => {
                console.log(res);
            })

    },
    renderActiveSession() {
        let { candidates, sessionNumber } = this.state;
        let numFields = 4;
        let maxLength = codeLength / numFields;
        return (
            <div className="voting-components">
                <h1 className="vote-header">Vote #{sessionNumber + 1}</h1>
                <CandidateList candidates={candidates} candidateClicked={this.handleCandidateClicked} />
                <div>
                    <h1 className="vote-header">Code</h1>
                    <CodeInput fields={numFields} maxLen={maxLength} ref={(c) => this.codeFields = c} />
                </div>
                <Button className="large" onClick={this.handleVoteSubmit}>Cast Vote</Button>
            </div>
        );
    },
    renderNoSession() {
        return (
            <div>
                <h1><span className="red">No</span> voting session at the time</h1>
                There is no election at the time, try again later.
            </div>
        );
    },
    render() {
        var { isOpen } = this.state;

        return (
            <div className={'main-box ' + (isOpen ? 'active-session' : 'no-active-session')}>
                {isOpen ? this.renderActiveSession() : this.renderNoSession()}
            </div>
        );
    }
});

module.exports = User;