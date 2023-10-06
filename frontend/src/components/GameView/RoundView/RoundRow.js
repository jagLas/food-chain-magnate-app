import { useCallback, useState } from "react"
import { useGameDispatch } from "../GameContext/GameContext"
import { useParams } from "react-router-dom"
import { actions } from "../GameContext/GameReducer";
import { usePatch } from "../../../utilities/auth";



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

    const dataProcessor = () => {
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

    const [data, isProcessing, sendData] = usePatch(`/games/${gameId}/rounds/${round.round_id}`, dataProcessor)

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

        function updateRound() {
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
    
            sendData(payload)
        }

        const currentTarget = e.currentTarget;

        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                checkForChange();
            }
        })
    }, [round,
        firstBurger, firstPizza, firstDrink, firstWaitress,
        cfo, unitPrice, salariesPaid, waitresses, sendData]
    )

    return (
        <div onBlur={blurEvent} className={"table-row" + (isProcessing ? ' processing' : '')}>
            <div className='player-name-field'>{round.player_name}</div>
            <div  className="table-subgroup milestones" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
                <div className="round-field">
                    <label htmlFor={'first-burger-' + round.player_name + '-round-' + round.round}>First Burger</label>
                    <input
                        id={'first-burger-' + round.player_name + '-round-' + round.round}
                        checked={firstBurger}
                        type="checkbox"
                        onChange={()=> setFirstBurger(!firstBurger)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label htmlFor={'first-pizza-' + round.player_name + '-round-' + round.round}>First Pizza</label>
                    <input
                        id={'first-pizza-' + round.player_name + '-round-' + round.round}
                        checked={firstPizza}
                        type="checkbox"
                        onChange={()=> setFirstPizza(!firstPizza)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label htmlFor={'first-drink-' + round.player_name + '-round-' + round.round}>First Drink</label>
                    <input
                        id={'first-drink-' + round.player_name + '-round-' + round.round}
                        checked={firstDrink}
                        type="checkbox"
                        onChange={()=> setFirstDrink(!firstDrink)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label htmlFor={'first-waitress-' + round.player_name + '-round-' + round.round}>First Waitress</label>
                    <input
                        id={'first-waitress-' + round.player_name + '-round-' + round.round}
                        checked={firstWaitress}
                        type="checkbox"
                        onChange={()=> setFirstWaitress(!firstWaitress)}
                    >
                    </input>
                </div>
                <div className="round-field">
                    <label htmlFor={'cfo-' + round.player_name + '-round-' + round.round}>CFO</label>
                    <input
                        id={'cfo-' + round.player_name + '-round-' + round.round}
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
                        htmlFor={'unit-price-' + round.player_name + '-round-' + round.round}
                    >Unit Price</label>
                    <input
                        id={'unit-price-' + round.player_name + '-round-' + round.round}
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        type='number'
                    ></input>
                </div>
                <div className="round-field">
                    <label htmlFor={'waitresses-' + round.player_name + '-round-' + round.round}>Waitress</label>
                    <input
                        id={'waitresses-' + round.player_name + '-round-' + round.round}
                        value={waitresses}
                        onChange={(e) => setWaitresses(e.target.value)}
                        type='number'
                    ></input>
                </div>
                <div className="round-field">
                    <label htmlFor={'salaries-paid' + round.player_name + '-round-' + round.round}>Salaries</label>
                    <input
                        id={'salaries-paid' + round.player_name + '-round-' + round.round}
                        value={salariesPaid}
                        onChange={(e) => setSalariesPaid(e.target.value)}
                        type='number'
                    ></input>
                </div>
            </div>
            <div className="table-subgroup optional-calcs" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
                <div className="round-field">
                    <div>Waitress Income</div>
                    {round.waitress_income ? round.waitress_income : 0}
                </div>
                <div className="round-field">
                    <div>Sales Revenue</div>
                    {round.sale_total ? round.sale_total : 0}
                </div>
                <div className="round-field">
                    <div>CFO Bonus</div>
                    {round.cfo_bonus ? round.cfo_bonus : 0}
                </div>
                <div className="round-field">
                    <div>Round Revenue</div>
                    {round.round_total ? round.round_total :  0}
                </div>
            </div>
            <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
                <div className="round-field">
                    <div className="single-row-label">Salaries Expense</div>
                    {-round.salaries_expense ? -round.salaries_expense : 0}
                </div>
                <div style={{fontWeight: '700'}} className="round-field">
                    <div className="single-row-label">Round Income</div>
                    {round.round_income ? round.round_income : 0}
                </div>
            </div>
        </div>
    )
}

export default RoundRow