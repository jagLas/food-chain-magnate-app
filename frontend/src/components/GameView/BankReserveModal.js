import './BankReserveModal.css'
import { useGame, useGameDispatch } from './GameContext/GameContext'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { actions } from './GameContext/GameReducer'
import { authFetch, usePatch } from '../../utilities/auth'

export default function BankReserveModal() {
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

    const onClickHandler = async (e) => {
        e.preventDefault()
        postData({reserve})
    }

    return (
        <>
            {bank.reserve || bank.total >= 0 ? null : 
            <div id="reserve-modal" className="modal">
                <div className='table-container'>
                    <h1>Bank Broken!</h1>
                    <p>
                        The bank has broken! Please reveal the reserve cards now
                        and enter their total below.

                        If you need to change this later due to an error, hover over the bank field
                        of the Game Totals table to update.
                    </p>
                    <form>
                        <label style={{fontWeight: '600'}}htmlFor='add-reserve-field'>
                            Bank Reserve
                        </label>
                        <input 
                            id='add-reserve-field'
                            value={reserve}
                            type='number'
                            step={100}
                            min={0}
                            max={1800}
                            onChange={onChangeHandler}
                        />          
                        <button onClick={onClickHandler}>Update Reserve</button>
                    </form>
                </div>
            </div>}
        </>

        
    )
}