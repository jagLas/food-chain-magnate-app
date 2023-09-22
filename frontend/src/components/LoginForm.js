import { useUserContext } from "../App";
import { authFetch } from "../utilities/auth";

export default function LoginForm () {
    const { setIsAuthenticated } = useUserContext()

    const login = async () => {
        const raw = JSON.stringify({
            "email": "bill@demo.com",
            "password": "password"
        });

        const requestOptions = {
            method: 'POST',
            body: raw
        };

        try{
            let data = await authFetch(`/auth/login`, requestOptions)
            console.log(data)
            setIsAuthenticated(true)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <button onClick={login}>Login</button>
    )
}