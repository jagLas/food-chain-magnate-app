import { useNavigate } from "react-router-dom";
import { useUserContext } from "../App";
import { authFetch } from "../utilities/auth";

export default function LogoutButton () {
    const { setIsAuthenticated } = useUserContext();
    const navigate = useNavigate();

    const logout = async () => {
        const requestOptions = {
            method: 'POST',
        };

        try{
            let data = await authFetch(`/auth/logout`, requestOptions);
            console.log(data);
            setIsAuthenticated(false);
            navigate('/')
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <button id='logout-button' onClick={logout}>Logout</button>
    )
}