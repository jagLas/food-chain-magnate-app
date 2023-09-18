import { NavLink, useNavigate, useParams } from "react-router-dom"
import RoundsTable from "./RoundsTable"
import SalesView from "./SalesView"
import { useMemo } from "react"
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { actions } from "./GameContext/GameReducer"
import './RoundView.css'
import './RoundNav.css'

export default function RoundView () {
    const {rounds, players} = useGame()
    const {gameId} = useParams()
    const dispatch = useGameDispatch()
    const navigate = useNavigate()


    const roundList = useMemo(() => {
        const numRounds = rounds.length / players.length
        const roundsArray = []
        roundsArray.push(<NavLink className={'round-selector all-rounds-tab' } key={0} to={`rounds/all`}>All</NavLink>)
        for (let i = 0; i < numRounds; i++) {
            const navLink = <NavLink className={'round-selector'} key={i + 1} to={`rounds/${i + 1}`}>{i+1}</NavLink>
            roundsArray.push(navLink)
        }
        return roundsArray
    }, [rounds.length, players.length])


    const formHandler = async (event) => {
        event.preventDefault()

        try {
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/rounds`, {
                method: 'POST'
            })
    
            data = await data.json()
    
            dispatch({
                type: actions.ADD_ROUNDS,
                payload: data
            })
    
            navigate(`rounds/${data[0].round}`)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div id='round-container'>
            <div id='round-view' className="table-container">
                <h2>Round</h2>
                <div id='round-nav'>
                    {roundList}
                    <button className={'round-selector add-round-button'} onClick={formHandler}>+</button>
                </div>
                <RoundsTable />
            </div>
            <SalesView/>
        </div>
    )
}