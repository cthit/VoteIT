import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { DigitButton, DigitText } from "@cthit/react-digit-components";
import { useHistory } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;

    margin: auto;

    max-width: 500px;
`;

const RawResult = () => {
    const history = useHistory();
    const [rawResult, setRawResult] = useState(null);

    useEffect(() => {
        axios.get("/api/result").then(response => setRawResult(response.data));
    }, []);

    return (
        <Container>
            <DigitButton
                outlined
                text={"Back"}
                onClick={() => history.push("/")}
            />
            <DigitText.Heading4 text={"Raw results"} />
            {rawResult != null && (
                <>
                    <div>
                        votesCount: {JSON.stringify(rawResult.votesCount)}
                    </div>
                    <div>--------------------</div>
                    <div>rawVotes: {JSON.stringify(rawResult.rawVotes)}</div>
                </>
            )}
        </Container>
    );
};

export default RawResult;
