var React = require('react');

var App = React.createClass({
    render() {

        return (
            <div className="main-body">
                {this.props.children}
            </div>
        );
    }
});


module.exports = App;