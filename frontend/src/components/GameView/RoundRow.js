import { useCallback, useState } from "react"
import { useGameDispatch } from "./GameContext/GameContext"
import { useParams } from "react-router-dom"
import { actions } from "./GameContext/GameReducer";



const RoundRow = ({round}) => {

    const [firstBurger, setFirstBurger] = useState(round.first_burger);
    const [firstPizza, setFirstPizza] = useState(round.first_pizza);
    const [firstDrink, setFirstDrink] = useState(round.first_drink);
    const [firstWaitress, setFirstWaitress] = useState(round.first_waitress);
    const [cfo, setCfo] = useState(round.cfo);
    const [unitPrice, setUnitPrice] = useState(round.unit_price);
    const [waitresses, setWaitresses] = useState(round.waitresses);
    const [salariesPaid, setSalariesPaid] = useState(round.salaries_paid);

    const {gameId} = useParams();
    const dispatch = useGameDispatch();

    // delays the blur even to prevent update when tabbing between fields
    const blurEvent = useCallback((e) => {
        // checks to see if there has been a change made to the round row and sends data to api
        // if changes is detected
        function checkForChange () {
            const stateValues = [
                firstBurger, firstPizza, firstDrink,
                firstWaitress, cfo, unitPrice, waitresses,
                salariesPaid
            ];

            const propValues = [
                round.first_burger, round.first_pizza, round.first_drink,
                round.first_waitress, round.cfo, round.unit_price, round.waitresses, 
                round.salaries_paid
            ];

            let different = false;
            for (let i = 0; i < stateValues.length; i++) {
                if (propValues[i] !== stateValues[i]) {
                    different = true;
                }
            }

            if (different) {
                updateRound()
            }
        }

        async function updateRound() {
            const payload = {
                round_id: round.round_id,
                first_burger: firstBurger,
                first_pizza: firstPizza,
                first_drink: firstDrink,
                first_waitress: firstWaitress,
                cfo: cfo,
                unit_price: unitPrice,
                waitresses: waitresses,
                salaries_paid: salariesPaid
            }
    
            // fetch statement code here post PATCH round to api
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/rounds/${round.round_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
    
            data = await data.json()
    
            // add dispatch for round record returned
            dispatch({
                type: actions.UPDATE_ROUND,
                payload: data.round
            })
    
            // add dispatch for sales records if sales have been returned
            // dispatching when no sales have been returned causes an error
            if (data.sales.length) {
                dispatch({
                    type: actions.UPDATE_SALES,
                    payload: data.sales
                })
            }
        }

        const currentTarget = e.currentTarget;

        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                checkForChange();
            }
        })
    }, [round, gameId, dispatch,
        firstBurger, firstPizza, firstDrink, firstWaitress,
        cfo, unitPrice, salariesPaid, waitresses]
    )

    return (
        <div onBlur={blurEvent} className="table-row">
            <div className='player-name-field' style={{padding: '0px 16px'}}>{round.player_name}</div>
            <div  className="table-subgroup milestones" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
                <div className="round-field">
                    <label for={'first-burger-' + round.player_name}>First Burger</label>
                    <input
                        id={'first-burger-' + round.player_name}
                        checked={firstBurger}
                        type="checkbox"
                        onChange={()=> setFirstBurger(!firstBurger)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label for={'first-pizza-' + round.player_name}>First Pizza</label>
                    <input
                        id={'first-pizza-' + round.player_name}
                        checked={firstPizza}
                        type="checkbox"
                        onChange={()=> setFirstPizza(!firstPizza)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label for={'first-drink-' + round.player_name}>First Drink</label>
                    <input
                        id={'first-drink-' + round.player_name}
                        checked={firstDrink}
                        type="checkbox"
                        onChange={()=> setFirstDrink(!firstDrink)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label for={'first-waitress-' + round.player_name}>First Waitress</label>
                    <input
                        id={'first-waitress-' + round.player_name}
                        checked={firstWaitress}
                        type="checkbox"
                        onChange={()=> setFirstWaitress(!firstWaitress)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label for={'cfo-' + round.player_name}>CFO</label>
                    <input
                        id={'cfo-' + round.player_name}
                        checked={cfo}
                        type="checkbox"
                        onChange={()=> setCfo(!cfo)}
                    >
                    </input>
                </div>
            </div>
            <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                <div className="round-field">
                    <label
                        className='single-row-label'
                        for={'unit-price-' + round.player_name}
                    >Unit Price</label>
                    <input
                        id={'unit-price-' + round.player_name}
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        type='number'
                    ></input>
                </div>
                <div className="round-field">
                    <label for={'waitresses-' + round.player_name}>Waitress</label>
                    <input
                        id={'waitresses-' + round.player_name}
                        value={waitresses}
                        onChange={(e) => setWaitresses(e.target.value)}
                        type='number'
                    ></input>
                </div>
                <div className="round-field">
                    <label for={'salaries-paid' + round.player_name}>Salaries</label>
                    <input
                        id={'salaries-paid' + round.player_name}
                        value={salariesPaid}
                        onChange={(e) => setSalariesPaid(e.target.value)}
                        type='number'
                    ></input>
                </div>
            </div>
            <div className="table-subgroup optional-calcs" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
                <div className="round-field">
                    <label>Waitress Income</label>
                    {round.waitress_income ? round.waitress_income : 0}
                </div>
                <div className="round-field">
                    <label>Sales Revenue</label>
                    {round.sale_total ? round.sale_total : 0}
                </div>
                <div className="round-field">
                    <label>CFO Bonus</label>
                    {round.cfo_bonus ? round.cfo_bonus : 0}
                </div>
                <div className="round-field">
                    <label>Round Revenue</label>
                    {round.round_total ? round.round_total :  0}
                </div>
            </div>
            <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
                <div className="round-field">
                    <label className="single-row-label">Salaries Expense</label>
                    {-round.salaries_expense ? -round.salaries_expense : 0}
                </div>
                <div className="round-field">
                    <label className="single-row-label">Round Income</label>
                    {round.round_income ? round.round_income : 0}
                </div>
            </div>
        </div>
    )
}

export default RoundRow