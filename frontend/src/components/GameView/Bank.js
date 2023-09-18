import { useParams } from "react-router-dom"
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { useEffect, useState } from "react"
import { actions } from "./GameContext/GameReducer"

export default function Bank ({totals}) {
    const {bank} = useGame()
    const [reserve, setReserve] = useState(bank.reserve)
    const {gameId} = useParams()
    const dispatch = useGameDispatch();

    // updates the form field after bank.reserve has been retrieved
    useEffect(() => {
        setReserve(bank.reserve)
    }, [bank.reserve])

    const onChangeHandler = (e) => {
        setReserve(e.target.value)
    }

    const onBlurHandler = async () => {
        let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/bank`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                reserve
            })
        })

        data = await data.json()

        dispatch({
            type: actions.UPDATE_BANK_RESERVE,
            payload: data
        })
    }

    return (
        <div className="table-row">
            <div style={{fontWeight: 700}}>
                Bank
                <div style={{fontWeight: 500}} className="details">
                    <div>Start: {bank.start}</div>
                    <div>
                        <label>Reserve:
                            <input
                                id='update-reserve'
                                value={reserve}
                                type='number'
                                step={100}
                                min={0}
                                max={1800}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
                            ></input>
                        </label>
                    </div>
                    <div>Player Sales: {-totals.total.income}</div>
                    <div>Remaining: {bank.total}</div>
                </div>
            </div>
            <div style={{fontWeight: 700}}>
                {bank.total}
            </div>
        </div>
    )
}