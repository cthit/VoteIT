import React from "react";
import {
    DigitEditDataCard,
    useDigitToast,
} from "@cthit/react-digit-components";
import useStatus from "../../../../common/hooks/use-status";
import CandidateList from "./components/candidate-list";
import axios from "axios";

const CastVote = () => {
    const [status, updateStatus] = useStatus();
    const [queueToast] = useDigitToast();

    if (status.candidates == null) {
        return null;
    }

    return (
        <DigitEditDataCard
            margin={"auto"}
            titleText={status.electionName}
            submitText={"Vote"}
            onSubmit={values => {
                const vote = values.candidates
                    .filter(candidate => candidate.choosen)
                    .map(candidate => candidate.id);

                axios
                    .post("/api/vote", { vote })
                    .then(() => {
                        queueToast({ text: "You have voted!" });
                        updateStatus();
                    })
                    .catch(error => {
                        queueToast({
                            text:
                                "Something went wrong when voting... Please contact one of the counters.",
                        });
                        console.log(error);
                    });
            }}
            initialValues={{
                candidates: [
                    ...status.candidates,
                    ...status.vacants,
                ].map(candidate => ({ ...candidate, choosen: false })),
            }}
            keysOrder={["candidates"]}
            keysComponentData={{
                candidates: {
                    component: CandidateList,
                    array: true,
                    formFieldArrayOptions: {
                        inputs: ["choosen"],
                    },
                },
            }}
        />
    );
};

export default CastVote;
