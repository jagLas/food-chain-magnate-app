import { useState } from "react"
import { useParams } from "react-router-dom"

export default function AddSaleForm() {
    const [burgers, setBurgers] = useState('')
    const [playerId, setPlayerId] = useState('')
    const [drinks, setDrinks] = useState('')
    const [pizzas, setPizzas] = useState('')
    const [garden, setGarden] = useState(false)
    const [roundNum, setRoundNum] = useState('')
    const [houseNum, setHouseNum] = useState('')

    const {gameId} = useParams()

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
        console.log(payload)

        try{
            let data = await fetch(`http://host.docker.internal:5000/games/${gameId}/sales`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
    
            data = await data.json()
        } catch (error){
            console.log(error)
        }

        
    }

    return (
        <form>
            <h3>Add a Sale</h3>
            <label>Player Id:
                <input
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    type="number"
                    id="player-id-field"
                ></input>
            </label>
            <label>Round #:
                <input
                    value={roundNum}
                    onChange={(e) => setRoundNum(e.target.value)}
                    type="number"
                    id="round-num-field"
                ></input>
            </label>
            <label>House #:
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
                    value={garden}
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
            <input type="submit" onClick={formHandler}></input>
        </form>
    )
}