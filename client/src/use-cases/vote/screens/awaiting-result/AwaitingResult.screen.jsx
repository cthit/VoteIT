import React from "react";
import CenterCard from "../../../../common/components/center-card";
import useStatus from "../../../../common/hooks/use-status";
import {
    DigitText,
    DigitButton,
    useDigitDialog,
} from "@cthit/react-digit-components";
import useIsAdmin from "../../../../common/hooks/use-is-admin";
import axios from "axios";
import UpdateStatusButton from "../../../../common/components/update-status-button";

const AwaitingResult = () => {
    const admin = useIsAdmin();
    const [status, updateStatus] = useStatus();
    const [showDialog] = useDigitDialog();

    const buttons = (
        <>
            {admin && (
                <DigitButton
                    text={"End voting"}
                    onClick={() => {
                        showDialog({
                            title: "Are you sure?",
                            description:
                                "This will end the current voting session",
                            confirmButtonText: "End voting",
                            cancelButtonText: "Cancel",
                            onConfirm: () =>
                                axios
                                    .post("/api/complete")
                                    .then(response => updateStatus()),
                        });
                    }}
                    primary
                    outlined
                />
            )}
            {<UpdateStatusButton />}
        </>
    );

    const body = (
        <>
            <DigitText.Text text={"Votes recieved: " + status.votesReceived} />
            <DigitText.Text
                text={"Eligible voters: " + status.eligibleVoters}
            />
        </>
    );

    return (
        <CenterCard
            title={"Awaiting result..."}
            body={body}
            buttons={buttons}
        />
    );
};

export default AwaitingResult;
