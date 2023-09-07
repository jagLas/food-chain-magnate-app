import { useState } from "react"

export default function AddSaleForm() {
    const [burgers, setBurgers] = useState('')
    const [playerId, setPlayerId] = useState('')
    const [drinks, setDrinks] = useState('')
    const [pizzas, setPizzas] = useState('')
    const [garden, setGarden] = useState(false)

    const formHandler = () => {
        const payload = {
            
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
            <input type="submit"></input>
        </form>
    )
}