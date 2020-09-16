import React from "react";
import CenterCard from "../../../../common/components/center-card";
import useIsAdmin from "../../../../common/hooks/use-is-admin";
import { useHistory } from "react-router-dom";
import { DigitButton, DigitText } from "@cthit/react-digit-components";
import UpdateStatusButton from "../../../../common/components/update-status-button";

const NoVote = () => {
    const admin = useIsAdmin();
    const history = useHistory();

    const buttons = admin ? (
        <>
            <DigitButton
                primary
                raised
                text={"Create vote session"}
                onClick={() => history.push("/admin/create-vote-session")}
            />
            <UpdateStatusButton />
        </>
    ) : null;

    const body = (
        <DigitText.Text
            text={"There is no election at this time, try again later."}
        />
    );

    return <CenterCard title={"No vote"} buttons={buttons} body={body} />;
};

export default NoVote;
