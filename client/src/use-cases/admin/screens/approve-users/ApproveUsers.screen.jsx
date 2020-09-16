import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Check from "@material-ui/icons/Check";
import {
    DigitText,
    DigitIconButton,
    DigitButton,
    useDigitToast,
} from "@cthit/react-digit-components";
import { useHistory } from "react-router-dom";

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto min-content;
    grid-auto-rows: auto;
    grid-gap: 1rem;

    align-items: center;

    margin: auto;
    justify-content: center;
    align-content: center;
`;

const HeadingContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: -1;
`;

const ApproveUsers = () => {
    const history = useHistory();
    const [users, setUsers] = useState();
    const [queueToast] = useDigitToast();

    const updateNotApprovedUsers = useCallback(() => {
        axios
            .get("/api/not-approved")
            .then(response => setUsers(response.data));
    }, [setUsers]);

    useEffect(() => {
        updateNotApprovedUsers();
    }, [updateNotApprovedUsers]);

    if (users == null) {
        return null;
    }

    const approveUser = user =>
        axios
            .post("/api/approve-user", { id: user.id })
            .then(() => updateNotApprovedUsers());

    return (
        <Grid>
            <DigitButton
                text={"Back"}
                onClick={() => history.push("/")}
                outlined
                gridColumn={{ start: "1", end: "-1" }}
            />
            <HeadingContainer>
                <DigitText.Heading4
                    text={
                        users.length === 0
                            ? "No users to approve"
                            : "Non approved users"
                    }
                />
            </HeadingContainer>
            <DigitButton
                text={"Update"}
                onClick={() => updateNotApprovedUsers()}
                gridColumn={{ start: "1", end: "-1" }}
                primary
                outlined
            />
            <DigitButton
                text={"Update Gamma cache"}
                onClick={() =>
                    axios
                        .post("/api/update-gamma-cache")
                        .then(() => queueToast({ text: "Gamma cache updated" }))
                }
                gridColumn={{ start: "1", end: "-1" }}
                outlined
            />
            {users.map(user => (
                <React.Fragment key={user.id}>
                    <DigitText.Text
                        text={
                            user.firstName +
                            ' "' +
                            user.nick +
                            '" ' +
                            user.lastName +
                            " - " +
                            user.acceptanceYear
                        }
                    />
                    <DigitIconButton
                        icon={Check}
                        onClick={() => approveUser(user)}
                    />
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default ApproveUsers;
