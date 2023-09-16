import { useState } from "react"
import { useParams } from "react-router-dom"
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { actions } from "./GameContext/GameReducer"
import './AddSaleForm.css'

function SalePlayerfield({player}){
    return (
        <option value={player.id}>
            {player.name}
        </option>
    )
}

export default function AddSaleForm() {
    const [burgers, setBurgers] = useState('')
    const [playerId, setPlayerId] = useState('')
    const [drinks, setDrinks] = useState('')
    const [pizzas, setPizzas] = useState('')
    const [garden, setGarden] = useState(false)
    const [houseNum, setHouseNum] = useState('')

    const {gameId, roundNum} = useParams()
    const game = useGame()
    const dispatch = useGameDispatch()


    const formHandler = async (event) => {
        event.preventDefault()

        const payload = {
            player_id: parseInt(playerId),
            round: parseInt(roundNum),
            house_number: parseInt(houseNum),
            garden: garden,
            burgers: parseInt(burgers),
            pizzas: parseInt(pizzas),
            drinks: parseInt(drinks)
        }

        try{
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/sales`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
    
            data = await data.json()
            
            dispatch({
                type: actions.ADD_SALE,
                payload: data.sale
            })

            dispatch({
                type: actions.UPDATE_ROUND,
                payload: data.round
            })

            for (const setter of [setBurgers, setPlayerId, setDrinks, setPizzas, setHouseNum].values()){
                setter('')
            }

            setGarden(false)

        } catch (error){
            console.log(error)
        }
    }

    const options = []
    for (const player of game.players.values()){
        options.push(<SalePlayerfield key={player.id} player={player}/>)
    }


    return (
        <>
        <h3>Add a Sale</h3>
        <form id='add-sale-form'>
            
            <label>Player:
                <select
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                >
                    <option value={''}></option>
                    {options}

                </select>
            </label>
            <label>House:
                <input 
                    value={houseNum}
                    onChange={(e) => setHouseNum(e.target.value)}
                    type="number"
                    id="house-num-field"
                    min="0"
                    max="30"
                    step="1"
                ></input>
            </label>
            <label>Garden:
                <input 
                    checked={garden}
                    onChange={() => setGarden(!garden)}
                    type="checkbox"
                    id="garden-field"
                ></input>
            </label>
            <label>Burgers:
                <input 
                    value={burgers}
                    onChange={(e) => setBurgers(e.target.value)}
                    type="number"
                    id="burgers-field"
                    min="0"
                    step="1"
                ></input>
            </label>
            <label>Pizzas:
                <input
                    value={pizzas}
                    onChange={(e) => setPizzas(e.target.value)}
                    type="number"
                    id="pizzas-field"
                    min="0"
                    step="1"
                ></input>
            </label>
            <label>Drinks:
                <input
                    value={drinks}
                    onChange={(e) => setDrinks(e.target.value)}
                    type="number"
                    id="drinks-field"
                    min="0"
                    step="1"
                ></input>
            </label>
            <div><div className="hidden">Submit</div>
                <input type="submit" value={'Submit'} onClick={formHandler} />
            </div>
            
            
            
        </form>
        </>

    )
}