var React = require('react');

var Candidate = function({ checked, disabled, candidate, onClick }) {
    let className = checked ? 'active' : '';

    if (disabled) {
        className = 'disabled';
    }

    return (
        <div className={'candidate ' + className} onClick={() => !disabled && onClick(candidate.id) }>
            <div className="status"><span className="text">{candidate.active ? '☑' : '☐'}</span></div>
            <div className="name">{candidate.name}</div>
            <div className="filler"><span></span></div>
        </div>
    );
};


module.exports = Candidate;
