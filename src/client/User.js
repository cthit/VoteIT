var React = require('react');

var Button = require('./Button');
var CodeInput = require('./CodeInput');
var CandidateList = require('./CandidateList');

var server = require('./backend');

const POSSIBLE_STATES = {
    noVote: "noVote",
    vote: "vote",
    result: "result"
};

var User = React.createClass({
    getInitialState() {
        return {
            sessionNumber: 0,
            maximumNbrOfVotes: 0,
            lowestVacantIndex: 0,
            voteState: POSSIBLE_STATES.noVote,
            candidates: [],
            vacants: [],
            winners: []
        }
    },
    componentWillMount() {
        this.getServerStatus();
        setInterval(() => {
            this.getServerStatus();
        }, 60000); // every minute
    },
    getServerStatus() {
        fetch('/status').then(res => res.json()).then(status => {
            this.setState({
                sessionNumber: status.sessionNumber,
                maximumNbrOfVotes: status.maximumNbrOfVotes,
                voteState: status.state,
                winners: status.winners || [],
                candidates: status.candidates || [],
                lowestVacantIndex: status.vacants[0] && status.vacants[0].id,
                vacants: status.vacants || [],
                codeLength: status.codeLength || 0
            });
        });
    },
    handleVacantClicked(id) {
        let lowestVacantIndex = this.state.lowestVacantIndex;

        var vacants = this.state.vacants.map((cand) => {
            if (cand.id === id) {
                let active = !cand.active;
                lowestVacantIndex = active ? id + 1 : id;

                return {
                    id: cand.id,
                    name: cand.name,
                    vacant: cand.vacant,
                    active
                };
            } else if (cand.id > id) {
                return {
                    id: cand.id,
                    name: cand.name,
                    vacant: cand.vacant,
                    active: false
                }
            } else {
                return cand;
            }
        });

        this.setState({
            vacants,
            lowestVacantIndex
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
    getCheckedCandidates() {
        return this.state.candidates.concat(this.state.vacants).filter(c => c.active);
    },
    handleVoteSubmit() {
        let code = this.codeFields.getCode();

        let vote = this.getCheckedCandidates().map(c => c.id);

        server.postJSON('/vote', { code, vote })
            .then((res) => {
                console.log(res);
            })

    },
    renderActiveSession() {
        let { candidates, vacants, sessionNumber, maximumNbrOfVotes, codeLength, lowestVacantIndex } = this.state;

        let numVotesLeft = maximumNbrOfVotes - this.getCheckedCandidates().length;

        let numFields = 3;
        let maxLength = codeLength / numFields;
        return (
            <div className="voting-components">
                <div className="vote-header">
                    <div className="left">Vote #{sessionNumber + 1}</div>
                    <div className="right">Selections left: {' ' + numVotesLeft}</div>
                </div>
                <CandidateList candidates={candidates} numVotesLeft={numVotesLeft} lowestVacantIndex={lowestVacantIndex} candidateClicked={this.handleCandidateClicked} />
                <CandidateList candidates={vacants} numVotesLeft={numVotesLeft} lowestVacantIndex={lowestVacantIndex} candidateClicked={this.handleVacantClicked} />
                <div>
                    <h1 className="vote-header">Code</h1>
                    <CodeInput fields={numFields} maxLen={maxLength} ref={(c) => this.codeFields = c} />
                </div>
                <Button className="large" onClick={this.handleVoteSubmit}>Cast Vote</Button>
            </div>
        );
    },
    renderWinners() {
        let { winners } = this.state;
        return (
            <div className="winners">
                <h1>Winners</h1>
                <ul>
                    {winners.map((winner, i) => (
                        <li key={i}>{winner.name}</li>
                    ))}
                </ul>
            </div>
        )
    },
    renderNoSession() {
        return (
            <div>
                <h1><span className="danger">No</span> voting session at the time</h1>
                There is no election at the time, try again later.
            </div>
        );
    },
    render() {
        var { voteState } = this.state;

        var renderFunction = null;
        let mainBoxClass = 'active-session';

        switch (voteState) {
            case POSSIBLE_STATES.noVote:
                renderFunction = this.renderNoSession;
                mainBoxClass = 'no-active-session';
                break;
            case POSSIBLE_STATES.vote:
                renderFunction = this.renderActiveSession;
                break;
            case POSSIBLE_STATES.result:
                renderFunction = this.renderWinners;
                break;
            default:
                console.error('Unhandled state', voteState);
        }

        return (
            <div className={'main-box ' + mainBoxClass}>
                {renderFunction && renderFunction()}
            </div>
        );
    }
});

module.exports = User;
