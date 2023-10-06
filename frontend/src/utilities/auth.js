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

export function useFetch(urlEndpoint, delayFetch, initialValue) {
    const [data, setData] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [requestOptions, setRequestOptions] = useState(delayFetch ? null : {method: 'GET'});
    const navigate = useNavigate();

    useEffect(() => {
        // checks if request options have been set. This allows for 'POST', 'PATCH', AND 'DELETE'
        // request to be set after user input.
        // Fetch will happen automatically if delayFetch is false as the request options will
        // be set to {method: 'GET'}
        if (requestOptions) {
            setIsLoading(true)
            authFetch(urlEndpoint, requestOptions)
            .then((res) => setData(res))
            .catch((error) => {
                console.error(error)
                navigate('/error', {state: { ...error }})
            })
            .finally(() => setIsLoading(false))
        }


    }, [urlEndpoint, requestOptions])

    return [data, isLoading, setRequestOptions]
}