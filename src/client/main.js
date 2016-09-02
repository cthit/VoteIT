var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;


var User = require('./User');
var Admin = require('./Admin');
var App = require('./App');
var CreateVoteSession = require('./CreateVoteSession');
var RawResult = require('./RawResult');
var PrintPage = require('./PrintPage');

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={User}></IndexRoute>
            <Route path="admin" component={Admin}></Route>
            <Route path="admin/createVoteSession" component={CreateVoteSession}></Route>
            <Route path="admin/rawResult" component={RawResult}></Route>
            <Route path="admin/print" component={PrintPage}></Route>
        </Route>
    </Router>
), document.getElementById('root'));
