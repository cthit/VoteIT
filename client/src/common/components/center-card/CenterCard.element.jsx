import React from "react";
import { DigitDesign } from "@cthit/react-digit-components";
import styled from "styled-components";

const BodyContainer = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: auto;
    grid-gap: 1rem;
`;

const CenterCard = ({ title, body, buttons }) => {
    return (
        <DigitDesign.Card
            margin={"auto"}
            size={{ minWidth: "200px", minHeight: "200px" }}
        >
            <DigitDesign.CardHeader>
                <DigitDesign.CardTitle text={title} />
            </DigitDesign.CardHeader>
            <DigitDesign.CardBody>
                <BodyContainer>{body}</BodyContainer>
            </DigitDesign.CardBody>
            <DigitDesign.CardButtons reverseDirection>
                {buttons}
            </DigitDesign.CardButtons>
        </DigitDesign.Card>
    );
};

export default CenterCard;
