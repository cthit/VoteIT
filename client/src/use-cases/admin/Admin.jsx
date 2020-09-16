import React from "react";
import { Switch, Route } from "react-router-dom";
import RawResult from "./screens/raw-result";
import CreateVoteSession from "./screens/create-vote-session";
import ApproveUsers from "./screens/approve-users";

const Admin = () => {
    return (
        <Switch>
            <Route path={"/admin/approve-users"} component={ApproveUsers} />
            <Route path={"/admin/raw-result"} component={RawResult} />
            <Route
                path={"/admin/create-vote-session"}
                component={CreateVoteSession}
            />
        </Switch>
    );
};

export default Admin;
