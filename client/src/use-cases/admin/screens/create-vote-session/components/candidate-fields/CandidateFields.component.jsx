import React from "react";
import {
    DigitTextField,
    DigitButton,
    DigitIconButton,
} from "@cthit/react-digit-components";
import styled from "styled-components";
import Delete from "@material-ui/icons/Delete";

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    grid-auto-columns: auto;
    grid-gap: 1rem;
`;

const CandidateFields = ({ innerInputs, push, remove }) => {
    return (
        <Grid>
            <DigitButton
                text={"Add option"}
                primary
                outlined
                onClick={() => push({ name: "" })}
                gridColumn={{ start: "1", end: "-1" }}
            />
            {innerInputs.map(({ name }, i) => (
                <React.Fragment key={i} /*Shouldn't be an index*/>
                    <DigitTextField
                        {...name}
                        outlined
                        upperLabel={"Option " + (i + 1)}
                    />
                    <DigitIconButton icon={Delete} onClick={() => remove(i)} />
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default CandidateFields;
