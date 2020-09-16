import React, { useMemo } from "react";
import styled from "styled-components";
import { DigitCheckbox } from "@cthit/react-digit-components";
import useStatus from "../../../../../../common/hooks/use-status";
import find from "lodash/find";

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: auto;
`;

const CandidateList = ({ value, innerInputs }) => {
    const [status] = useStatus();
    const candidatesChoosen = useMemo(
        () =>
            value.reduce((n, candidate) => (candidate.choosen ? n + 1 : n), 0),
        /*eslint-disable */
        [JSON.stringify(value)] //Stringify is neccessary since just using value won't update properly
    );
    /*eslint-enable */

    const lowestVacantIndex = useMemo(() => {
        const vacantCandidate = find(
            value.filter(candidate => candidate.vacant),
            ["choosen", false]
        );

        return vacantCandidate == null ? -1 : vacantCandidate.id;
        /*eslint-disable */
    }, [JSON.stringify(value)]);
    /*eslint-enable */

    return (
        <Grid>
            {value.map((candidate, i) => (
                <React.Fragment key={i} /*Don't use index*/>
                    <DigitCheckbox
                        primary
                        {...innerInputs[i].choosen}
                        label={candidate.name}
                        disabled={
                            (status.maximumNbrOfVotes === candidatesChoosen &&
                                !candidate.choosen) ||
                            (!candidate.choosen &&
                                candidate.vacant &&
                                candidate.id > lowestVacantIndex)
                        }
                    />
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default CandidateList;
