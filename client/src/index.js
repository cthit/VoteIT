import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { DigitProviders } from "@cthit/react-digit-components";
import { StatusContextWrapper } from "./common/hooks/use-status";

ReactDOM.render(
    <React.StrictMode>
        <DigitProviders>
            <StatusContextWrapper>
                <App />
            </StatusContextWrapper>
        </DigitProviders>
    </React.StrictMode>,
    document.getElementById(`root`)
);
