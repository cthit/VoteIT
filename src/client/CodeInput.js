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
    render() {
        let { values } = this.state;
        return (
            <div className="multi-input">
                {values.map((val, i, arr) => (
                    <div key={i} className="inline-input">
                        <input type="text" ref={(c) => this.input[i] = c} value={values[i]} onChange={(event) => this.handleOnChange(i, event)}/>
                        {i < (arr.length - 1) && (<span className="dash">-</span>)}
                    </div>
                ))}
            </div>
        );
    }
});


module.exports = CodeInput;