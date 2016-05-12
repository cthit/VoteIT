var React = require('react');

const arrayOfLength = (len) =>
    Array.apply(null, Array(len)).map(String.prototype.valueOf, '');


var CodeInput = React.createClass({
    getInitialState() {
        return {
            values: arrayOfLength(this.props.fields)
        };
    },
    componentWillMount() {
        this.input = [];
    },
    getCode() {
        return this.state.values.join('')
    },
    handleOnChange(index, { target: { value } }) {
        let { maxLen } = this.props;

        if (value.length <= maxLen) {

            let values = this.state.values.map((val, i) => {
                if (index === i) {
                    return value;
                } else {
                    return val;
                }
            });
            this.setState({
                values
            });
        }

        if (value.length >= maxLen) {
            let field = this.input[index + 1];
            if (field) {
                field.focus();
            }
        }
    },
    handleOnFocus({ target }) {
        target.select();
        target.setSelectionRange(0, 10);
    },
    render() {
        const { values } = this.state;
        const { maxLen } = this.props;

        const emWidth = maxLen + 2 + 'em';
        return (
            <div className="multi-input">
                <input type="text" style={{width: emWidth}} autoCapitalize="none" autoComplete="off" autoCorrect="off" ref={(c) => this.input[0] = c} value={values[0]} onFocus={this.handleOnFocus} onChange={(event) => this.handleOnChange(0, event)}/>
                <span className="dash"> - </span>
                <input type="text" style={{width: emWidth}} autoCapitalize="none" autoComplete="off" autoCorrect="off" ref={(c) => this.input[1] = c} value={values[1]} onFocus={this.handleOnFocus} onChange={(event) => this.handleOnChange(1, event)}/>
                <span className="dash"> - </span>
                <input type="text" style={{width: emWidth}} autoCapitalize="none" autoComplete="off" autoCorrect="off" ref={(c) => this.input[2] = c} value={values[2]} onFocus={this.handleOnFocus} onChange={(event) => this.handleOnChange(2, event)}/>
            </div>
        );
    }
});


module.exports = CodeInput;
