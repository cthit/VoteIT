import React from "react";
import useStatus from "../../common/hooks/use-status";
import NoVote from "./screens/no-vote";
import CastVote from "./screens/cast-vote";
import AwaitingResult from "./screens/awaiting-result";
import Result from "./screens/result/Result.screen";
import WaitingRoom from "./screens/waiting-room";

const Vote = () => {
    const [status] = useStatus();

    if (status.state === "notApproved") {
        return <WaitingRoom />;
    }

    if (status.state === "noVote") {
        return <NoVote />;
    }

    if (status.userVoted) {
        return <AwaitingResult />;
    }

    if (status.state === "vote") {
        return <CastVote />;
    }

    if (status.state === "result") {
        return <Result />;
    }

    return <div>loading...</div>;
};

export default Vote;
