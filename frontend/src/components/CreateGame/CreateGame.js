import { useEffect, useState } from "react"
import PlayerField from "./PlayerField"
import { useNavigate } from "react-router-dom"

const CreateGameForm = () => {
    const [playerList, setPlayerList] = useState([])
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [player3, setPlayer3] = useState('')
    const [player4, setPlayer4] = useState('')
    const [player5, setPlayer5] = useState('')

    const fetchPlayers = async () => {
        let data = await fetch('http://host.docker.internal:5000/players');
        data = await data.json();
        setPlayerList(data)
    }

    useEffect(() => {
        fetchPlayers()
    }, [])


    const createGame = async (payload) => {
        let data = await fetch('http://host.docker.internal:5000/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        })

        data = await data.json()
        return data
    }

    const navigate = useNavigate();
    const formHandler = async (event) => {
        event.preventDefault()
        
        let player_ids = players.filter((player) => {
            if (player !== '') {
                return player
            }
        })

        player_ids = player_ids.map(playerId => {
            return parseInt(playerId)
        })

        const payload = {
            player_ids,
            bank_start: player_ids.length * 50
        }
        try{
            const data = await createGame(JSON.stringify(payload));
            navigate(`/games/${data.id}`);
        } catch(error){
            console.log(error)
        }
    }

    
    // variables to dynamically create select field for form
    const players = [player1, player2, player3, player4, player5]
    const setPlayers = [setPlayer1, setPlayer2, setPlayer3, setPlayer4, setPlayer5]
    const playerFields= []
    
    // loop to iterate through each player option
    for (let i = 0; i < 5; i++) {
        playerFields.push(
            <PlayerField
                player={players[i]}  //the player variable
                selectedPlayers={players.slice(0, i).concat(players.slice(i + 1))}  //players selected in other fields
                setPlayer={setPlayers[i]}  //the player variable setting function
                playerList={playerList}  //list of all players in db
                key={i}
                playerNum={i}/>)  //which player number it is for
    }


    return (
        <>
            <form>
                {playerFields}
                <button onClick={formHandler}>Create Game</button>
            </form>
        </>
    )
}

export default CreateGameForm