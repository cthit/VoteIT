import React from "react";
import styled from "styled-components";
import useStatus from "../../../../common/hooks/use-status";
import {
    DigitDesign,
    DigitText,
    DigitButton,
} from "@cthit/react-digit-components";
import useIsAdmin from "../../../../common/hooks/use-is-admin";
import { useHistory } from "react-router-dom";
import UpdateStatusButton from "../../../../common/components/update-status-button";

const Container = styled.div`
    display: flex;
    flex-direction: column;

    margin: auto;

    max-width: 650px;
`;

const WinnerContainer = styled.div`
    width: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    justify-content: center;
    align-content: center;
`;

const Result = () => {
    const [status] = useStatus();
    const history = useHistory();
    const admin = useIsAdmin();

    if (status == null) {
        return null;
    }

    return (
        <Container>
            <DigitText.Heading4 text={"Results:"} />
            <WinnerContainer>
                {status.winners.map(winner => (
                    <DigitDesign.Card
                        key={winner.id}
                        margin={"1rem"}
                        size={{ width: "200px", height: "200px" }}
                    >
                        <DigitDesign.CardBody
                            alignContent={"center"}
                            justifyContent={"center"}
                        >
                            <DigitText.Text bold text={winner.name} />
                        </DigitDesign.CardBody>
                    </DigitDesign.Card>
                ))}
            </WinnerContainer>
            {!admin && <UpdateStatusButton />}
            {admin && (
                <DigitButton
                    text={"View raw results"}
                    outlined
                    onClick={() => history.push("/admin/raw-result")}
                    size={{ maxWidth: "300px" }}
                />
            )}
            {admin && (
                <DigitButton
                    text={"Create new vote session"}
                    outlined
                    onClick={() => history.push("/admin/create-vote-session")}
                    size={{ maxWidth: "300px" }}
                />
            )}
        </Container>
    );
};

export default Result;
