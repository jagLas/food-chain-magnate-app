import { useNavigate } from "react-router-dom";
import { useUserContext } from "../App";
import { authFetch, usePost } from "../utilities/auth";
import ProcessingModal from "./ProcessingModal";

export default function LogoutButton () {
    const { setIsAuthenticated } = useUserContext();
    const navigate = useNavigate();

    const dataProcessor = () => {
        setIsAuthenticated(false);
        navigate('/')
    }
    const [data, isProcessing, postData] = usePost(`/auth/logout`, dataProcessor)

    const logout = () => {
        postData()
    }

    return (
        <>
            <button id='logout-button' onClick={logout}>Logout</button>
            {isProcessing ? <ProcessingModal /> : false}
        </>
    )
}