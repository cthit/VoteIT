var React = require('react');

var { getJSON } = require('./backend');

var RawResult = React.createClass({

  componentDidMount() {
    this.getRawResult();
  },
  getInitialState() {
      return {
        data: {},
        hasData: false
      };
  },
  getRawResult() {
    getJSON('/admin/result').then(data => {
        this.setState({
          data: data,
          hasData: true
        });
    }, (err) => {
        this.setState({
          data: {},
          hasData: false
        });
    });
  },
    render() {
        let {data, hasData} = this.state;
        if(hasData) {

          return (
              <div className="raw-result-wrapper">
              {data.votesCount.map((candidate, index) => (
                <div className="raw-result-candidate" key={index}>Value: {candidate.value} CandidateId: {candidate.item.id} CandidateName: {candidate.item.name} </div>
              ))}
              <div className="raw-result-winner-container">
              {data.winners.map((winner, index) => (
                <div className="raw-result-winner" key={index}> WinnerId: {winner.id} WinnerName: {winner.name} </div>
              ))}
              </div>
              </div>
            );
        } else {
          return (<div>Error retrieving raw result data</div>);
        }
    }
});

module.exports = RawResult;
