import { useParams } from "react-router-dom"
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { useEffect, useState } from "react"
import { actions } from "./GameContext/GameReducer"

export default function Bank () {
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
        <>
            <span>Start: {bank.start}</span>
            <label>Reserve:
                <input
                    value={reserve}
                    type='number'
                    step={100}
                    min={0}
                    max={1800}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                ></input>
            </label>
            <span>Remaining: {bank.total}</span>
        </>
    )
}