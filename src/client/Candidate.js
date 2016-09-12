var React = require('react');

var Candidate = function({ checked, disabled, candidate, onClick }) {
    let className = checked ? 'active' : '';

    if (disabled) {
        className = 'disabled';
    }

    return (
        <div className={'candidate ' + className} onClick={() => !disabled && onClick(candidate.id) }>
            <div className="status"><span className="text">{candidate.active ? renderCheckSvg() : ''}</span></div>
            <div className="name">{candidate.name}</div>
            <div className="filler"><span></span></div>
        </div>
    );
};

const renderCheckSvg = () => (
    <svg height="27" id="svg3386" version="1.1" viewBox="0 0 35 27" width="35">
      <g id="Page-1" transform="translate(8.4,7.1)">
        <g fill="#fff" id="Core" transform="matrix(2,0,0,2,-9.2,-6.3)">
          <g id="check">
            <path d="M 6,10.2 1.8,6 0.4,7.4 6,13 18,1 16.6,-0.4 6,10.2 Z" id="Shape"/>
          </g>
        </g>
      </g>
    </svg>
)


module.exports = Candidate;
