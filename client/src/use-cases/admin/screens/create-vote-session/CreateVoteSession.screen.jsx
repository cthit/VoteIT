import React, { useEffect } from "react";
import axios from "axios";
import {
    DigitButton,
    DigitEditDataCard,
    DigitTextField,
    DigitCheckbox,
    useDigitToast,
    useDigitDialog,
} from "@cthit/react-digit-components";
import { useHistory } from "react-router-dom";
import CandidateFields from "./components/candidate-fields";
import useStatus from "../../../../common/hooks/use-status";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;

    margin: auto;
`;

const CreateVoteSession = () => {
    const [status, updateStatus] = useStatus();
    const history = useHistory();
    const [queueToast] = useDigitToast();
    const [showDialog] = useDigitDialog();

    useEffect(() => {
        if (status.state === "vote") {
            queueToast({ text: "A voting session has already been started" });
            updateStatus();
            history.push("/");
        }
    }, [status.state, history, updateStatus, queueToast]);

    return (
        <Container>
            <DigitButton
                margin={{ bottom: "1rem" }}
                outlined
                onClick={() => history.push("/")}
                text={"Back"}
            />
            <DigitEditDataCard
                onSubmit={({
                    electionName,
                    candidates,
                    maxCandidates,
                    vacant,
                }) => {
                    showDialog({
                        title: "Are you sure?",
                        description:
                            "This will start a new voting session immediately",
                        confirmButtonText: "Start voting session",
                        cancelButtonText: "Cancel",
                        onConfirm: () =>
                            axios
                                .post("/api/create-vote-session", {
                                    candidates: candidates.map(
                                        candidate => candidate.name
                                    ),
                                    vacant,
                                    max_candidates: maxCandidates,
                                    electionName,
                                })
                                .then(() => {
                                    updateStatus();
                                    history.push("/");
                                })
                                .catch(error =>
                                    queueToast({
                                        text: error.response.data,
                                    })
                                ),
                    });
                }}
                margin={"auto"}
                titleText={"Create vote session"}
                submitText={"Start vote session"}
                keysOrder={[
                    "electionName",
                    "maxCandidates",
                    "vacant",
                    "candidates",
                ]}
                initialValues={{
                    electionName: "Val av ledamöter",
                    maxCandidates: 1,
                    vacant: false,
                    candidates: [{ name: "" }, { name: "" }],
                }}
                keysComponentData={{
                    electionName: {
                        component: DigitTextField,
                        componentProps: {
                            upperLabel: "Name of the election",
                            outlined: true,
                        },
                    },
                    maxCandidates: {
                        component: DigitTextField,
                        componentProps: {
                            numbersOnly: true,
                            upperLabel: "Max selections per vote",
                            outlined: true,
                        },
                    },
                    vacant: {
                        component: DigitCheckbox,
                        componentProps: {
                            primary: true,
                            label: "Vacant enabled",
                        },
                    },
                    candidates: {
                        component: CandidateFields,
                        array: true,
                        formFieldArrayOptions: {
                            //TODO: Use instead user id so that online voting can become easier. Meaning you can use avatar url.
                            inputs: ["name"],
                        },
                    },
                }}
            />
        </Container>
    );
};

export default CreateVoteSession;
