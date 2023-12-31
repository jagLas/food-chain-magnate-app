import { useState } from "react"
import PlayerField from "./PlayerField"
import { useNavigate } from "react-router-dom"
import { CardColor } from "../../utilities/card-schemes"
import { useGet, usePost } from "../../utilities/auth"
import Loading from "../Loading"

const CreateGameForm = () => {
    const [playerList, isLoading] = useGet('/players')

    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [player3, setPlayer3] = useState('')
    const [player4, setPlayer4] = useState('')
    const [player5, setPlayer5] = useState('')
    const navigate = useNavigate();

    const dataProcessor = () => {
        navigate(`/games/${data.id}/rounds/1`)
    }

    const [data, isProcessing, postData] = usePost(`/games/`, dataProcessor)

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

        postData(payload)
    }

    
    // variables to dynamically create select field for form
    const players = [player1, player2, player3, player4, player5]
    const setPlayers = [setPlayer1, setPlayer2, setPlayer3, setPlayer4, setPlayer5]
    const playerFields= []
    
    // loop to iterate through each player option
    for (let i = 0; i < 5; i++) {
        playerFields.push(
            <PlayerField
                isLoading={isLoading}
                player={players[i]}  //the player variable
                selectedPlayers={players.slice(0, i).concat(players.slice(i + 1))}  //players selected in other fields
                setPlayer={setPlayers[i]}  //the player variable setting function
                playerList={playerList ? playerList : []}  //list of all players in db
                key={i} // normally, not ok, but this list will not be sorted or added or deleted
                playerNum={i} //which player number it is for
                cardScheme={CardColor.getCardScheme(i)}
                />)
    }


    return (
        <div>
            {isProcessing ? <Loading message='Processing'/> :
            <>
            <h2 className="menu-header">Create a Game</h2>
            
            <form id="create-game">
                <ul className="card-list">
                    {playerFields}
                </ul>
                <button className='menu-button' onClick={formHandler}>Create Game</button>
                <button
                    className="menu-button"
                    onClick={() => navigate('/players/create-player')}
                >Create a player</button>
            </form>
            </>}
        </div>
    )
}

export default CreateGameForm