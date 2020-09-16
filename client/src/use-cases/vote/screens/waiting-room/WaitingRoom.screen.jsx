import React from "react";
import CenterCard from "../../../../common/components/center-card";
import { DigitText } from "@cthit/react-digit-components";
import UpdateStatusButton from "../../../../common/components/update-status-button";

const WaitingRoom = () => {
    const body = (
        <DigitText.Text
            text={"You have not yet been approved by the meetings counters."}
        />
    );

    const buttons = <UpdateStatusButton />;

    return (
        <CenterCard title={"Not approved yet"} body={body} buttons={buttons} />
    );
};

export default WaitingRoom;
