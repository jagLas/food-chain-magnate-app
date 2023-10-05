import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function checkAuth() {
    return getCookie('csrf_access_token')
}

export const authFetch = async (urlEndpoint, options={method: 'GET'}) => {
    // wrapper function to add necessary headers and credentials to an authorized request
    const myHeaders = new Headers();
    if (options.method !== 'GET') {
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append("X-CSRF-TOKEN", getCookie('csrf_access_token'))
    }

    let requestOptions = {
        ...options,
        credentials: 'include',
        headers: myHeaders
    }

    const res = await (fetch(`${'/api' + urlEndpoint}`, requestOptions))
    const resData = await res.json()

    if (res.ok) {
        return resData
    }

    const e = new Error()
    e.message = resData.description
    e.statusCode = res.status
    if (resData.name) {
        e.name = 'Error-' + resData.name
    }

    console.log(res.status, resData)
    console.error(e)

    throw e
}

export function useFetch(urlEndpoint) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true)
        authFetch(urlEndpoint)
            .then((res) => setData(res))
            .catch((error) => {
                console.error(error)
                navigate('/error', {state: { ...error }})
            })
            .finally(() => setIsLoading(false))
    }, [urlEndpoint])

    return [data, isLoading]
}