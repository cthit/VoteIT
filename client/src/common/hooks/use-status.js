import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import axios from "axios";
import { useGammaMe } from "@cthit/react-digit-components";

const StatusContext = createContext([]);

function useStatus() {
    const [status, update] = useContext(StatusContext);

    return [status, update];
}

const StatusContextWrapper = ({ children }) => {
    const me = useGammaMe();
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(false);

    const update = useCallback(() => {
        if (loading) {
            return;
        }
        setLoading(true);
        axios
            .get("/api/status")
            .then(response => {
                setStatus(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (error.response.data === "You cannot vote yet") {
                    setStatus({ state: "notApproved" });
                    setLoading(false);
                }
            });
    }, [setStatus, loading, setLoading]);

    const userLoaded = me != null;

    useEffect(() => {
        if (userLoaded && Object.keys(status).length === 0) {
            update();
        }
    }, [userLoaded, status, update]);

    return (
        <StatusContext.Provider value={[status, update]}>
            {children}
        </StatusContext.Provider>
    );
};

export default useStatus;
export { StatusContextWrapper };
