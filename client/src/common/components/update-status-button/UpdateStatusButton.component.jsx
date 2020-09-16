import React, { useState, useEffect } from "react";
import useStatus from "../../hooks/use-status";
import { DigitButton } from "@cthit/react-digit-components";

const UpdateStatusButton = () => {
    const [, updateStatus] = useStatus();
    const [updateDisabled, setUpdateDisabled] = useState(false);

    useEffect(() => {
        if (updateDisabled) {
            setTimeout(() => {
                setUpdateDisabled(false);
            }, 1000);
        }
    }, [updateDisabled, setUpdateDisabled]);

    return (
        <DigitButton
            text={"Update"}
            onClick={() => {
                updateStatus();
                setUpdateDisabled(true);
            }}
            primary
            outlined
            disabled={updateDisabled}
            size={{ maxWidth: "300px" }}
        />
    );
};

export default UpdateStatusButton;
