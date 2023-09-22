import { useEffect } from "react"
import { useUserContext } from "../App"
import { checkAuth } from "../utilities/auth"
import { useNavigate } from "react-router-dom"

export default function ErrorPage () {
    const { setIsAuthenticated } = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        const redirect = setTimeout(() => {
            navigate('/')
        }, 5000)
        return () => clearTimeout(redirect)
    }, [])

    useEffect(() => {
        if (!checkAuth()) {
            setIsAuthenticated(false)
        }
    }, [])

    return (
        <>
            <h1>An Error occured</h1>
            <h3>Redirecting you to the home page</h3>
        </>
        
    )
}