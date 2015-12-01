var React = require('react');

var Popout = require('react-popout');

var Button = require('./Button');
var PrintPage = require('./PrintPage');

var { getJSON, postJSON } = require('./backend');

const TOKEN_KEY = 'token';

var Admin = React.createClass({
    getInitialState() {
        return {
            signedIn: Boolean(window.sessionStorage.getItem(TOKEN_KEY)),
            codes: [],
            ongoingVote: false,
            voteCompleted: false,
            error: false
        };
    },
    componentWillMount() {
        this.getServerStatus();
    },
    getServerStatus() {
        fetch('/status').then(res => res.json()).then(status => {
            this.setState({
                ongoingVote: status.votingOpened,
                voteCompleted: status.votingCompleted
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
        if (!this.state.ongoingVote || confirm('Really generate new codes?')) {
            getJSON('/admin/print').then(data => {
                this.setState({showPrint: true, codes: data.codes});
            }, (err) => {
                if (err.status === 401) {
                    this.clearToken();
                }
            });
        }
    },
    confirmEndVote() {
        if (this.state.ongoingVote && confirm('Really end voting session?')) {
            postJSON('/admin/complete', {}).then(() => {
                this.history.replaceState(null, '/');
            }, (err) => {
                if (err.status === 401) {
                    this.clearToken();
                }
            });
        }
    },
    renderPrintPage(codes) {
        return (
            <Popout title="Print codes" url="/print.html" onClosing={this.setState({showPrint: false, codes: []})}>
                <PrintPage codes={codes} />
            </Popout>
        );
    },
    render() {
        let { signedIn, error, ongoingVote, voteCompleted, showPrint, codes } = this.state;


        if (signedIn) {
            return (
                <div>
                    <Button className="large red" onClick={this.confirmOpenPrintPage}>Generate and print new codes</Button>
                    {ongoingVote && !voteCompleted ?
                        <Button className="large red" onClick={this.confirmEndVote}>End ongoing vote</Button>
                        :
                        <Button className="large"
                                onClick={() => this.props.history.pushState(null, '/admin/createVoteSession')}>
                            Create new voting session
                        </Button>
                    }
                    <Button onClick={this.clearToken}>Sign out</Button>
                    {showPrint && this.renderPrintPage(codes)}
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
