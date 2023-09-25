import { useEffect } from "react"
import { useUserContext } from "../App"
import { checkAuth } from "../utilities/auth"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export default function ErrorPage (props) {
    const { setIsAuthenticated } = useUserContext()
    const navigate = useNavigate()
    const {state} = useLocation()

    // useEffect(() => {
    //     const redirect = setTimeout(() => {
    //         navigate('/')
    //     }, 5000)
    //     return () => clearTimeout(redirect)
    // }, [])

    useEffect(() => {
        if (!checkAuth()) {
            setIsAuthenticated(false)
        }
    }, [])

    return (
        <>
            <h1>An Error occured</h1>
            <h2>{state && state.statusCode}</h2>
            <h3>{state && state.message}</h3>
            <button className="menu-button" onClick={() => navigate('/')}>Home</button>
        </>
    )
}