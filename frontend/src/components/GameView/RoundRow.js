import { useCallback, useMemo, useState } from "react"
import { useGame, useGameDispatch } from "../GameContext"
import { useParams } from "react-router-dom"
import { actions } from "../GameReducer";



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
        const currentTarget = e.currentTarget;

        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                checkForChange();
            }
        })
    }, [checkForChange])

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
            if (propValues[i] != stateValues[i]) {
                different = true;
            }
        }

        console.log(different)
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

    return (
        <>
            <tr onBlur={blurEvent}>
                <td>{round.player_name}</td>
                <td>
                    <input
                        checked={firstBurger}
                        type="checkbox"
                        onChange={()=> setFirstBurger(!firstBurger)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={firstPizza}
                        type="checkbox"
                        onChange={()=> setFirstPizza(!firstPizza)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={firstDrink}
                        type="checkbox"
                        onChange={()=> setFirstDrink(!firstDrink)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={firstWaitress}
                        type="checkbox"
                        onChange={()=> setFirstWaitress(!firstWaitress)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={cfo}
                        type="checkbox"
                        onChange={()=> setCfo(!cfo)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        type='number'
                    ></input>
                </td>
                <td>
                    <input
                        value={waitresses}
                        onChange={(e) => setWaitresses(e.target.value)}
                        type='number'
                    ></input>
                </td>
                <td>
                    <input
                        value={salariesPaid}
                        onChange={(e) => setSalariesPaid(e.target.value)}
                        type='number'
                    ></input>
                </td>
                <td>{round.waitress_income ? round.waitress_income : 0}</td>
                <td>{round.sale_total ? round.sale_total : 0}</td>
                <td>{round.cfo_bonus ? round.cfo_bonus : 0}</td>
                <td>{round.round_total ? round.round_total :  0}</td>
                <td>{-round.salaries_expense ? -round.salaries_expense : 0}</td>
                <td>{round.round_income ? round.round_income : 0}</td>
            </tr>
        </>
    )
}

export default RoundRow