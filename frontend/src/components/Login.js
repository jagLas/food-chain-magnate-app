export default function Login () {

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const login = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": "bill@demo.com",
            "password": "password"
        });

        const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        try{
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/auth/login`, requestOptions)
            data = await data.json()
            console.log(data)
            let cookie = getCookie('csrf_access_token')
            console.log(cookie)
        } catch(error) {
            console.log(error)
        }
    }

    const logout = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: myHeaders,
            redirect: 'follow'
            };

        try{
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/auth/logout`, requestOptions)
            data = await data.json()
            console.log(data)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
        </>

    )
}