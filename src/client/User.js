var React = require('react');

var Button = require('./Button');
var CodeInput = require('./CodeInput');
var CandidateList = require('./CandidateList');

var server = require('./backend');

const POSSIBLE_STATES = {
    noVote: "noVote",
    vote: "vote",
    awaitingResult: "awaitingResult",
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
            winners: [],
            errors: []
        }
    },
    componentWillMount() {
        this.getServerStatus();
        this.pauseTimeout = false;

        let refreshServerStatus = () => {
            this.getServerStatus().then(() => {
                if (!this.pauseTimeout) {
                    setTimeout(refreshServerStatus, 60000);
                }
            });
        };

        setTimeout(() => {
            refreshServerStatus()
        }, 60000); // every minute
    },
    mergeVoteState(prevState, nextState) {
        if (prevState === POSSIBLE_STATES.awaitingResult) {
            if (nextState === POSSIBLE_STATES.result) {
                return nextState;
            } else {
                return prevState;
            }
        } else {
            return nextState;
        }

    },
    getServerStatus() {
        return fetch('/status').then(res => res.json()).then(status => {
            let voteState = this.mergeVoteState(this.state.voteState, status.state);
            this.setState({
                sessionNumber: status.sessionNumber,
                maximumNbrOfVotes: status.maximumNbrOfVotes,
                voteState,
                winners: status.winners || [],
                candidates: status.candidates || [],
                lowestVacantIndex: status.vacants && status.vacants[0] && status.vacants[0].id,
                vacants: status.vacants || [],
                codeLength: status.codeLength || 0
            });

            this.pauseTimeout = voteState === POSSIBLE_STATES.vote;
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
        let errors = [];
        let voteState = this.state.voteState;
        let code = this.codeFields.getCode();

        let vote = this.getCheckedCandidates().map(c => c.id);

        server.postJSON('/vote', { code, vote })
            .then(res => {
                voteState = POSSIBLE_STATES.awaitingResult;
            })
            .catch(e => {
                return e.text().then(message => {
                    errors = [message.replace('FAIL: ', '')];
                });
            }).then(() => {
                this.setState({
                    errors,
                    voteState
                });
            });
    },
    renderActiveSession() {
        let { errors, candidates, vacants, sessionNumber, maximumNbrOfVotes, codeLength, lowestVacantIndex } = this.state;

        let numVotesLeft = maximumNbrOfVotes - this.getCheckedCandidates().length;

        let numFields = 3;
        let maxLength = codeLength / numFields;
        return (
            <div className="voting-components">
                <div className="vote-header">
                    <div className="left">Vote #{sessionNumber + 1}</div>
                    <div className="right">Selections left: {numVotesLeft}</div>
                </div>
                <CandidateList candidates={candidates} numVotesLeft={numVotesLeft} lowestVacantIndex={lowestVacantIndex} candidateClicked={this.handleCandidateClicked} />
                <CandidateList candidates={vacants} numVotesLeft={numVotesLeft} lowestVacantIndex={lowestVacantIndex} candidateClicked={this.handleVacantClicked} />
                <div>
                    <h1 className="vote-header">Code</h1>
                    <CodeInput fields={numFields} maxLen={maxLength} ref={(c) => this.codeFields = c} />
                </div>
                {errors.length > 0 && (
                    <ul className="errors">
                        {errors.map((e, index) => (<li key={index}>{e + '!'}</li>))}
                    </ul>
                )}
                <Button className="large" onClick={this.handleVoteSubmit}>Cast Vote</Button>
            </div>
        );
    },
    renderAwaitingResult() {
        return (
            <div>
                <h1 className="success">Vote submitted</h1>
                <h2>Awaiting result…</h2>
            </div>
        );
    },
    renderWinners() {
        let { winners } = this.state;
        return (
            <div className="winners">
                <h1>Election results</h1>
                <h5>In no particular order</h5>
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
                <h1><span className="danger">No</span> voting session currently active</h1>
                There is no election at this time, try again later.
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
            case POSSIBLE_STATES.awaitingResult:
                renderFunction = this.renderAwaitingResult;
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
