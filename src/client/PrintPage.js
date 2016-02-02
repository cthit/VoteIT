var React = require('react');
var _ = require('lodash');

const formatCode = code => _.chunk(code, 3).map(c => c.join('')).join('-');

const PrintPage = ({ codes }) => (
  <div className="code-wrapper">
  {_.chunk(codes, 8).map((codes8, index) => (
      <div className="users-container" key={index}>
          {codes8.map((userCodes, index) => (
              <div className="one-user-codes" key={index}>
                      {userCodes.map((code, index) => (
                          <div key={index}>
                              <span>{index + 1} </span>
                              <span>{formatCode(code)}</span>
                          </div>
                      ))}
              </div>
          ))}
      </div>
  ))}
   </div>
)

module.exports = PrintPage;
