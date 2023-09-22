import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authFetch } from "../utilities/auth";

export default function CreatePlayer() {
    const [playerName, setPlayerName] = useState('')
    const navigate = useNavigate();

    const createPlayer = async (payload) => {
        let data = await authFetch(`/players`, {
            method: 'POST',
            body: payload
        })

        return data
    }
    
    const formHandler = async (event) => {
        event.preventDefault()

        const payload = {
            name: playerName,
        }

        try{
            await createPlayer(JSON.stringify(payload));
            navigate(`/players`);
        } catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <form id='create-player'>
                <div className="card-format">
                    <label htmlFor='create-player-input' className="card-top">
                        <h2>Name: </h2>
                    </label>
                    <div className="card-bottom">
                        <input id='create-player-input' type="text" value={playerName} onChange={(event) => setPlayerName(event.target.value)}></input>
                    </div>
                </div>


                <button onClick={formHandler}>Create Player</button>
            </form>
        </>
    )
}