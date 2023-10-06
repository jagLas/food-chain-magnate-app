import { useCallback, useEffect, useState } from "react";
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

export function useGet(urlEndpoint, initialValue) {
    // takes a urlEndpoint, and an initialValue
    // automatically fetches data from that endpoint
    const {data, isLoading} = useFetch(urlEndpoint, true, initialValue)
    return [data, isLoading]
}

export function usePost(urlEndpoint, action) {
    const {data, isLoading, sendData, resetData} = useFetch(urlEndpoint, false, null, action);
    const postData = (payload) => {
        return sendData('POST', payload)
    }

    return [data, isLoading, postData, resetData]
}

export function usePatch(urlEndpoint, action) {
    const {data, isLoading, sendData, resetData} = useFetch(urlEndpoint, false, null, action);
    const patchData = (payload) => {
        return sendData('PATCH', payload)
    }

    return [data, isLoading, patchData, resetData]
}

export function useDelete(urlEndpoint, action) {
    const {data, isLoading, sendData, resetData} = useFetch(urlEndpoint, false, null, action);
    const deleteData = (payload) => {
        return sendData('DELETE', payload)
    }

    return [data, isLoading, deleteData, resetData]
}

export function useFetch(urlEndpoint, fetch, initialValue, action) {
    const [data, setData] = useState(initialValue);
    const [startFetch, setStartFetch] = useState(fetch);
    const [isLoading, setIsLoading] = useState(false);
    const [requestOptions, setRequestOptions] = useState();
    const navigate = useNavigate();

    const resetData = useCallback(() => {
        setData(null)
        setRequestOptions(null)
    }, [setData, setRequestOptions])

    const sendData = (method, payload) => {
        const requestOptions = {
            method: method,
            body: JSON.stringify(payload)
        }
        setRequestOptions(requestOptions)
        setStartFetch(true)
    }

    // if an action was provided into the hook, that function will be called
    // if there is data to process. Useful to automatically add data to reducer
    // or to navigate on successful fetch
    useEffect(() => {
        if (data && action) {
            action()
            resetData()
        }
    }, [action, data, resetData])

    useEffect(() => {
        if (startFetch) {
            setIsLoading(true)
            authFetch(urlEndpoint, requestOptions)
            .then((res) => setData(res))
            .catch((error) => {
                console.error(error)
                navigate('/error', {state: { ...error }})
            })
            .finally(() => {
                setIsLoading(false)
                setStartFetch(false)
            })
        }
    }, [urlEndpoint, requestOptions, startFetch, navigate])

    return {data, resetData, isLoading, sendData}
}