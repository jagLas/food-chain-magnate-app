import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreatePlayer() {
    const [playerName, setPlayerName] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const createPlayer = async (payload) => {
        let data = await fetch(`${process.env.REACT_APP_DB_URL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        })

        data = await data.json()
        return data
    }
    
    const formHandler = async (event) => {
        event.preventDefault()

        const payload = {
            name: playerName,
            password
        }

        try{
            await createPlayer(JSON.stringify(payload));
            navigate(`/games/create-game`);
        } catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <form>
                <label>
                    Name: 
                    <input type="text" value={playerName} onChange={(event) => setPlayerName(event.target.value)}></input>
                </label>
                <label>
                    password: 
                    <input type="text" value={password} onChange={event => setPassword(event.target.value)}></input>
                </label>
                <button onClick={formHandler}>Create Player</button>
            </form>
        </>
    )
}