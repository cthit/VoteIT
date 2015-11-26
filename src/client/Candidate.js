var React = require('react');

var Candidate = function({ candidate, onClick }) {
    return (
        <div className={'candidate ' + (candidate.active ? 'active' : '')} onClick={() => onClick(candidate.id) }>
            <div className="status"><span className="text">{candidate.active ? '☑' : '☐'}</span></div>
            <div className="name">{candidate.name}</div>
            <div className="filler"><span></span></div>
        </div>
    );
};


module.exports = Candidate;