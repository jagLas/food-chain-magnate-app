import { useUserContext } from "../App";
import { authFetch, usePost } from "../utilities/auth";
import { useState } from "react"
import ProcessingModal from "./ProcessingModal";

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [signup, setSignup] = useState(false)
    const [name, setName] = useState('');
    const { setIsAuthenticated } = useUserContext()

    const dataProcessor = () => {
        setIsAuthenticated(true)
    }
    const [loginData, loginIsLoading, loginPostData] = usePost(`/auth/login`, dataProcessor)
    const [signupData, signupIsLoading, signupPostData] = usePost(`/auth/signup`, dataProcessor)

    const loginFormHandler = (event) => {
        event.preventDefault()

        const payload = {
            email: email,
            password
        }

        loginPostData(payload)
    }

    const signupFormHandler = (event) => {
        event.preventDefault()

        if (!signup) {
            return setSignup(true)
        }
        
        const payload = {
            email,
            password,
            name
        }

        signupPostData(payload)
    }

    return (
        <>
            {loginIsLoading || signupIsLoading ? <ProcessingModal /> : false}
            <form id='create-player'>
                <div className="card-format">
                    <div className="card-top">
                        <label  htmlFor="login-email">
                            <h2 style={{marginTop: '16px'}}>Email </h2>
                        </label>
                        <input
                            autoFocus
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
                                    autoFocus
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
                    {!signup &&
                    <button
                        className='menu-button'
                        onClick={loginFormHandler}
                    >Login</button>}
                    <button
                        className='menu-button'
                        onClick={signupFormHandler}
                    >Sign Up</button>
                    {signup &&
                    <button
                        className="menu-button"
                        onClick={() => setSignup(false)}
                    >Return</button>}
                </div>
            </form>
        </>
    )
}