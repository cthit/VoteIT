var React = require('react');

var Button = require('./Button');

var Admin = React.createClass({
    render() {

        return (
            <div>
                <Button className="large" onClick={() => window.open('/admin/print')}>Generate and print new codes</Button>
                <Button className="large" onClick={() => this.props.history.pushState(null, '/admin/createVoteSession')}>Create new voting session</Button>
            </div>
        );
    }
});

module.exports = Admin;
