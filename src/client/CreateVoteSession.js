var React = require('react');

var Button = require('./Button');

var server = require('./backend');

var CreateVoteSession = React.createClass({
    getInitialState() {
        return {
            maxCandidates: 0,
            allowVacants: false,
            options: ['', '']
        };
    },
    addOptionField() {
        this.setState({
            options: this.state.options.concat([''])
        });
    },
    removeOptionField(index) {
        if (this.state.options.length < 3) {
            return;
        }
        this.setState({
            options: this.state.options.filter((o, i) => i !== index)
        });
    },
    changeOptionValue(index, { target: { value } }) {
        this.setState({
            options: this.state.options.map((val, i) => {
                if (i === index) {
                    return value;
                } else {
                    return val;
                }
            })
        }, () => {
            if (index === this.state.options.length - 1) {
                this.addOptionField();
            }
        });
    },
    changeMaxCandidates({ target: { value } }) {
        this.setState({
            maxCandidates: value
        });
    },
    changeAllowVacant({ target: { checked } }) {
        this.setState({
            allowVacants: checked
        });
    },
    handleSubmitSession() {
        let { maxCandidates, allowVacants, options } = this.state;

        server.postJSON('/createVoteSession', {
            candidates: options,
            vacant: allowVacants,
            max_candidates: maxCandidates
        }).then((res) => {
            console.log(res);
        })
    },
    renderOptionField(value, index) {
        return (
            <div className="form-group" key={index}>
                <label htmlFor={'option' + index}>Option #{index + 1}:</label>
                <input type="text" id={'option' + index} value={value} placeholder="Write an option.." onChange={(e) => this.changeOptionValue(index, e)} />
                <Button onClick={() => this.removeOptionField(index)}>⨉</Button>
            </div>
        );
    },
    render() {
        let { maxCandidates, allowVacants, options } = this.state;

        return (
            <div className="vote-session-form">
                <h1>Create Vote Session</h1>
                <div className="form-group">
                    <label htmlFor="max_candidates">Max selections per vote:</label>
                    <input type="number" autofocus min={0} id="max_candidates" onChange={this.changeMaxCandidates} value={maxCandidates} placeholder="Write the max allowed options.." />
                </div>
                <div className="form-group">
                    <label htmlFor="vacant">Vacant enabled:</label>
                    <input type="checkbox" id="vacant" checked={allowVacants} onChange={this.changeAllowVacant} />
                </div>
                <div className="options">
                    {options.map((opt, i) => this.renderOptionField(opt, i))}
                </div>
                <div>
                    <Button onClick={this.addOptionField}>+</Button>
                </div>

                <Button className="large" onClick={this.handleSubmitSession}>Start session</Button>
            </div>
        );
    }
});


module.exports = CreateVoteSession;