import { useEffect } from "react"
import { useUserContext } from "../App"
import { checkAuth } from "../utilities/auth"
import { useLocation, useNavigate } from "react-router-dom"

export default function ErrorPage (props) {
    const { setIsAuthenticated } = useUserContext()
    const navigate = useNavigate()
    const {state, pathname} = useLocation()

    console.log(pathname)

    // useEffect(() => {
    //     const redirect = setTimeout(() => {
    //         navigate('/')
    //     }, 5000)
    //     return () => clearTimeout(redirect)
    // }, [])

    useEffect(() => {
        // checks if user still has authentication cookies
        if (!checkAuth()) {
            setIsAuthenticated(false)
        }
    }, [setIsAuthenticated])

    if (pathname !== '/error') {
        return (
            <>
            <h1>Page Not Found</h1>
            <h2>{404}</h2>
            <h3>The Requested Page Could Not Be Found</h3>
            <button className="menu-button" onClick={() => navigate(-1)}>Go Back</button>
            <button className="menu-button" onClick={() => navigate('/')}>Home</button>
        </>
        )
    }

    return (
        <>
            <h1>An Error occured</h1>
            <h2>{state && state.statusCode}</h2>
            <h3>{state && state.message}</h3>
            <button className="menu-button" onClick={() => navigate(-1)}>Go Back</button>
            <button className="menu-button" onClick={() => navigate('/')}>Home</button>
        </>
    )
}