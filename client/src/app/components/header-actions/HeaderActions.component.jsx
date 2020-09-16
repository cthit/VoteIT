import React from "react";
import { useHistory } from "react-router-dom";
import { DigitGammaActions } from "@cthit/react-digit-components";
import useIsAdmin from "../../../common/hooks/use-is-admin";
import axios from "axios";

const handleCustomOptionsOnClick = history => item => {
    switch (item) {
        case "adminApproveVoters":
            history.push("/admin/approve-users");
            break;
        default:
            break;
    }
};

const HeaderActions = () => {
    const admin = useIsAdmin();
    const history = useHistory();

    return (
        <DigitGammaActions
            signOut={() => axios.post("/api/sign-out")}
            customOptionsOnClick={handleCustomOptionsOnClick(history)}
            customOptions={{
                adminApproveVoters: "Approve voters",
            }}
            customOrder={
                admin
                    ? ["adminApproveVoters", "viewAccount", "signOut"]
                    : ["viewAccount", "signOut"]
            }
        />
    );
};

export default HeaderActions;
