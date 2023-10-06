import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authFetch, useFetch } from "../utilities/auth";
import Loading from "./Loading";

export default function CreatePlayer() {
    const [playerName, setPlayerName] = useState('')
    const [data, isLoading, setRequestOptions] = useFetch('/players', true);
    const navigate = useNavigate();

    useEffect(() => {
        // if there is response data, redirect to players page
        if (data) {
            // console.log('data is true')
            navigate('/players')
        }
    }, [data])

    const formHandler = async (event) => {
        event.preventDefault()

        const payload = {
            name: playerName,
        }

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload)
        }

        // makes the fetch using hook
        setRequestOptions(requestOptions)
    }

    return (
        <div>
            <h2 className="menu-header">Create a Player</h2>
            <form id='create-player'>
                {isLoading ? <Loading message='Processing' /> :<>
                <div className="card-format">
                <label htmlFor='create-player-input' className="card-top">
                    <h2>Name: </h2>
                </label>
                <div className="card-bottom">
                    <input autoFocus id='create-player-input' type="text" value={playerName} onChange={(event) => setPlayerName(event.target.value)}></input>
                </div>
            </div>

            </>
                }
            <button className='menu-button' onClick={formHandler}>Create Player</button>
                
            </form>
        </div>
    )
}