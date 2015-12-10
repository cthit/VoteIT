var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;


var User = require('./User');
var Admin = require('./Admin');
var App = require('./App');
var CreateVoteSession = require('./CreateVoteSession');

ReactDOM.render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute path="" component={User}></IndexRoute>
            <Route path="admin" component={Admin}></Route>
            <Route path="admin/createVoteSession" component={CreateVoteSession}></Route>
        </Route>
    </Router>
), document.getElementById('root'));
