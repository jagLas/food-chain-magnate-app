import { useUserContext } from "../App";
import { authFetch } from "../utilities/auth";
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const { setIsAuthenticated } = useUserContext()

    const createPlayer = async (payload) => {
        let data = await authFetch(`/auth/login`, {
            method: 'POST',
            body: payload
        })

        return data
    }

    const loginFormHandler = async (event) => {
        event.preventDefault()

        const payload = {
            email: email,
            password
        }

        try{
            await createPlayer(JSON.stringify(payload));
            setIsAuthenticated(true);
        } catch(error){
            navigate('/error', {state: { ...error }})
        }
    }

    const signupFormHandler = async (event) => {
        event.preventDefault()

        const payload = {
            email: email,
            password
        }
    }

    return (
        <>
            <form id='create-player'>
                <div className="card-format">
                    <label className="card-top">
                        <h2>Email </h2>
                        <input type="text" value={email} onChange={(event) => setEmail(event.target.value)}></input>
                    </label>
                    <label className="card-bottom">
                        password: 
                        <input type="password" value={password} onChange={event => setPassword(event.target.value)}></input>
                    </label>
                </div>

                <button className='menu-button' onClick={loginFormHandler}>Login</button>
                <button className='menu-button' onClick={signupFormHandler}>Sign Up</button>
            </form>
        </>
    )
}