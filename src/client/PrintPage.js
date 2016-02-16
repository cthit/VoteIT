var React = require('react');
var _ = require('lodash');

var { getJSON } = require('./backend');

const formatCode = code => _.chunk(code, 3).map(c => c.join('')).join('-');
const formatIndex = index => index > 9 ? index : ' ' + index;

const PrintPage = React.createClass({

    getInitialState() {
        return {
            codes: []
        };
    },

    componentDidMount() {
        getJSON('/admin/print').then(({ codes }) => {
            this.setState({
                codes
            });
        });
    },

    renderRow(codes) {
        return _.zip(...codes).map((voteSessionCodes, index) => (
            voteSessionCodes.map((code) => (
                (formatIndex(index + 1)) + ' ' + formatCode(code)
            )).join('\t')
        )).join('\n');
    },

    render() {
        const { codes } = this.state;

        return (
            <pre className="code-wrapper">
                {_.chunk(codes, 4).map(this.renderRow).join('\n\n')}
            </pre>
        );
    }
});

module.exports = PrintPage;
