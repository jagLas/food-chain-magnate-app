import { useUserContext } from "../App";
import { authFetch } from "../utilities/auth";
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [signup, setSignup] = useState(false)
    const [name, setName] = useState('');
    const { setIsAuthenticated } = useUserContext()
    const navigate = useNavigate();

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

        if (!signup) {
            return setSignup(true)
        }
        
        const payload = {
            email,
            password,
            name
        }

        try {
            const data = await authFetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            console.log(data)

            setIsAuthenticated(true);
        } catch (e) {
            navigate('/error', {state: { ...e }})
        }
    }

    return (
        <>
            <form id='create-player'>
                <div className="card-format">
                    <div className="card-top">
                        <label  htmlFor="login-email">
                            <h2 style={{marginTop: '16px'}}>Email </h2>
                        </label>
                        <input
                            id='login-email'
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        {signup &&
                            <>
                                <label htmlFor="name-signup">
                                    <h2>Name:</h2>
                                </label>
                                <input
                                    id='name-signup'
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </>
                        }
                    </div>
                    <label className="card-bottom">
                        password: 
                        <input id="login-password" 
                            type="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                        />
                    </label>
                </div>
                <div>
                    {!signup && <button className='menu-button' onClick={loginFormHandler}>Login</button>}
                    <button className='menu-button' onClick={signupFormHandler}>Sign Up</button>
                    {signup && <button className="menu-button" onClick={() => setSignup(false)}>Return</button>}
                </div>
            </form>
        </>
    )
}