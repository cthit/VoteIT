import React, { useEffect } from "react";
import { useGamma, DigitHeader } from "@cthit/react-digit-components";
import { Switch, Route } from "react-router-dom";
import Vote from "../use-cases/vote";
import Admin from "../use-cases/admin";
import HeaderActions from "./components/header-actions";
import useIsAdmin from "../common/hooks/use-is-admin";
import useStatus from "../common/hooks/use-status";

const App = () => {
    const [, updateStatus] = useStatus();
    const [loading] = useGamma("/api/me", "/api/code");
    const admin = useIsAdmin();

    useEffect(() => {
        window.onfocus = function () {
            updateStatus();
        };
    }, [updateStatus]);

    if (loading) {
        return null;
    }

    return (
        <DigitHeader
            title={"VoteIT"}
            headerRowProps={{
                size: { width: "100%" },
                flex: "1",
                justifyContent: "space-between",
            }}
            renderHeader={() => <HeaderActions />}
            toolbarHeight={"auto"}
            renderMain={() => (
                <Switch>
                    {admin && <Route path={"/admin"} component={Admin} />}
                    <Route path={"/"} component={Vote} />
                </Switch>
            )}
        />
    );
};

export default App;
