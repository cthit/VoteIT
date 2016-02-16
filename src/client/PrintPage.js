var React = require('react');
var _ = require('lodash');

const formatCode = code => _.chunk(code, 3).map(c => c.join('')).join('-');
const formatIndex = index => index > 9 ? index : ' ' + index;

const formatRow = codes => _.zip(...codes).map((voteSessionCodes, index) => (
    voteSessionCodes.map((code) => (
        (formatIndex(index + 1)) + ' ' + formatCode(code)
    )).join('\t')
)).join('\n')


const PrintPage = ({ codes }) => (
    <pre className="code-wrapper">
        {_.chunk(codes, 4).map(formatRow).join('\n\n')}
    </pre>
);

module.exports = PrintPage;
