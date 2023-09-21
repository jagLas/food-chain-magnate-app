import { useEffect, useState } from "react"
import PlayerField from "./PlayerField"
import { useNavigate } from "react-router-dom"
import { CardColor } from "../card-schemes"
import { authFetch } from "../../utilities/auth"

const CreateGameForm = () => {
    const [playerList, setPlayerList] = useState([])
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [player3, setPlayer3] = useState('')
    const [player4, setPlayer4] = useState('')
    const [player5, setPlayer5] = useState('')


    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                let data = await fetch(`${process.env.REACT_APP_DB_URL}/players`);
                data = await data.json();
                setPlayerList(data)
            } catch(error) {
                console.log(error)
            }
        }

        fetchPlayers()
    }, [])


    const createGame = async (payload) => {
        let data = await authFetch(`/games/`, {
            method: 'POST',
            body: payload
        })

        return data
    }

    const navigate = useNavigate();
    const formHandler = async (event) => {
        event.preventDefault()
        
        let player_ids = players.filter((player) => {
            if (player !== '') {
                return player
            } else{
                return false
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
            const gameData = await createGame(JSON.stringify(payload));

            // creates a starting set of rounds after creating a new game
            await authFetch(`/games/${gameData.id}/rounds`, {
                method: 'POST'
            })

            navigate(`/games/${gameData.id}/rounds/1`);

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
                playerNum={i} //which player number it is for
                cardScheme={CardColor.getCardScheme(i)}
                />)  
    }


    return (
        <>
            <form id="create-game">
                <ul className="card-list">
                    {playerFields}
                </ul>
                <button onClick={formHandler}>Create Game</button>
            </form>
        </>
    )
}

export default CreateGameForm