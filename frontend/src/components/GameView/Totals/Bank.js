import { useParams } from "react-router-dom"
import { useGame, useGameDispatch } from "../GameContext/GameContext"
import { useEffect, useState } from "react"
import { actions } from "../GameContext/GameReducer"
import { usePatch } from "../../../utilities/auth"

export default function Bank ({totals}) {
    const {bank} = useGame()
    const [reserve, setReserve] = useState(bank.reserve)
    const {gameId} = useParams()
    const dispatch = useGameDispatch();

    const dataProcessor = () => {
        dispatch({
            type: actions.UPDATE_BANK_RESERVE,
            payload: data
        })
    }
    const [data, isProcessing, postData] = usePatch(`/games/${gameId}/bank`, dataProcessor)

    // updates the form field after bank.reserve has been retrieved
    useEffect(() => {
        setReserve(bank.reserve)
    }, [bank.reserve])

    const onChangeHandler = (e) => {
        setReserve(e.target.value)
    }

    const onBlurHandler = () => {
        postData({reserve})
    }

    return (
        <div className={"table-row"  + (isProcessing ? ' processing' : '')}>
            <div style={{fontWeight: 700}}>
                Bank
                <div style={{fontWeight: 400}} className="details">
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