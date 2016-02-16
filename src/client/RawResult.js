var React = require('react');

var Button = require('./Button');

var { getJSON } = require('./backend');

var RawResult = React.createClass({

  componentDidMount() {
    this.getRawResult();
  },
  getInitialState() {
    return {
      data: {},
      hasData: false,
      showRawVotes: false
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
  handleRawResultToggle() {
    let { showRawVotes } = this.state;
    this.setState({
      showRawVotes: !showRawVotes
    })
  },
  render() {
    let {data, hasData, showRawVotes} = this.state;

    if(hasData) {
      data.rawVotes = data.rawVotes.concat(data.rawVotes).concat(data.rawVotes).concat(data.rawVotes).concat(data.rawVotes);

      return (
        <div className="raw-result-page-container">
        <div className="summary-result-wrapper">
        {data.votesCount.map((candidate, index) => (
          <div className="summary-result-candidate" key={index}>Value: {candidate.value} CandidateId: {candidate.item.id} CandidateName: {candidate.item.name} </div>
          ))}
        <div className="summary-result-winner-container">
        {data.winners.map((winner, index) => (
          <div className="summary-result-winner" key={index}> WinnerId: {winner.id} WinnerName: {winner.name} </div>
          ))}
        </div>
        </div>
        <Button onClick={this.handleRawResultToggle}>Toggle raw votes</Button>
        {showRawVotes && (
          <div className="raw-results-wrapper">
          <h2>Number votes: {data.rawVotes.length}</h2>
          <div className="raw-results-explaination">Each row of: [candidateId1 ... candidateIdN] represents one persons vote.</div>
          {data.rawVotes.map((rawResult, index) => (
            <div className="raw-vote" key={index}> { JSON.stringify(rawResult) } </div>
            ))}
          </div>
          )}
        </div>
        );
    } else {
      return (<div>Error retrieving raw result data</div>);
    }
  }
});

module.exports = RawResult;
