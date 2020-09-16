import { useGammaMe } from "@cthit/react-digit-components";

function useIsAdmin() {
    const me = useGammaMe();
    if (me == null) {
        return false;
    }
    return me.voteIT.admin;
}

export default useIsAdmin;
