var React = require('react');

var Popout = require('react-popout');

var Button = require('./Button');
var PrintPage = require('./PrintPage');

var { postJSON } = require('./backend');

const TOKEN_KEY = 'token';

const POSSIBLE_STATES = {
    noVote: "noVote",
    vote: "vote",
    result: "result"
};

var Admin = React.createClass({
    getInitialState() {
        return {
            signedIn: Boolean(window.sessionStorage.getItem(TOKEN_KEY)),
            voteState: POSSIBLE_STATES.noVote,
            votesReceived: 0,
            error: false
        };
    },
    componentWillMount() {
        this.getServerStatus();
    },
    getServerStatus() {
        fetch('/status').then(res => res.json()).then(status => {
            this.setState({
                codesGenerated: status.codesGenerated,
                votesReceived: status.votesReceived,
                voteState: status.state
            });
        });
    },
    clearToken() {
        window.sessionStorage.removeItem(TOKEN_KEY);
        this.setState({
            signedIn: false,
            error: false
        });
    },
    handleOnSubmit() {
        let input = this.passwordField.value;
        this.passwordField.value = '';

        postJSON('/login', {
            pass: input
        }).then(res => {
            if (res.status === 403) {
                this.setState({
                    signedIn: false,
                    error: true
                });
            } else {
                window.sessionStorage.setItem(TOKEN_KEY, res.headers.get('Authorization').substring(6));
                this.setState({
                    signedIn: true,
                    error: false
                });
            }
        });
    },
    confirmOpenPrintPage() {
        if (!this.state.codesGenerated || confirm('Really generate new codes?')) {
            this.props.history.pushState(null, '/admin/print');
        }
    },
    confirmEndVote() {
        if (this.state.voteState === POSSIBLE_STATES.vote && confirm('Really end voting session?')) {
            postJSON('/admin/complete', {}).then(() => {
                this.getServerStatus();
                this.props.history.replaceState(null, '/');
            }, (err) => {
                if (err.status === 401) {
                    this.clearToken();
                }
            });
        }
    },
    render() {
        let { signedIn, error, votesReceived, voteState } = this.state;
        let voteInProgress = voteState === POSSIBLE_STATES.vote;

        if (signedIn) {
            return (
                <div>
                    {voteInProgress &&
                        <div className="vote-header">
                            <div className="center">Votes received: {votesReceived || '0'}</div>
                        </div>
                    }
                    {voteInProgress && <Button className="large red" onClick={this.confirmEndVote}>End ongoing vote</Button>}
                    {!voteInProgress && <Button className="large red" onClick={this.confirmOpenPrintPage}>Generate and print new codes</Button>}
                    {!voteInProgress && <Button className="large"
                                onClick={() => this.props.history.pushState(null, '/admin/createVoteSession')}>
                            Create new voting session
                        </Button>}
                    <Button className="small" onClick={() => this.props.history.pushState(null, '/admin/rawResult')}>Show raw result</Button>
                    <Button className="small" onClick={this.clearToken}>Sign out</Button>
                </div>
            );
        } else {
            return (
                <div>
                    <form onSubmit={this.handleOnSubmit}>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" autofocus ref={c => this.passwordField = c} />
                        </div>
                        <Button onClick={this.handleOnSubmit}>Submit</Button>
                    </form>
                    {error && <div className="red dist">Error: Wrong password!</div>}
                </div>
            );
        }
    }
});

module.exports = Admin;
