import { useEffect } from "react"
import { useUserContext } from "../App"
import { checkAuth } from "../utilities/auth"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function ErrorPage () {
    const { setIsAuthenticated } = useUserContext()
    const navigate = useNavigate()
    const [params, setParams] = useSearchParams()

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

    const query = params.get("statusCode")
    console.log(query)
    return (
        <>
            <h1>An Error occured</h1>
            <h3>{params.get("statusCode")}</h3>
            <h3>{params.get("message")}</h3>
            <button onClick={() => navigate('/')}>Home</button>
        </>
        
    )
}