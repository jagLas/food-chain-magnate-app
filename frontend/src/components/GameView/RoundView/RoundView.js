import { NavLink, useNavigate, useParams } from "react-router-dom"
import RoundsTable from "./RoundsTable"
import SalesView from "../SalesView/SalesView"
import { useMemo } from "react"
import { useGame, useGameDispatch } from "../GameContext/GameContext"
import { actions } from "../GameContext/GameReducer"
import { usePost } from "../../../utilities/auth"
import './RoundView.css'
import './RoundNav.css'

export default function RoundView () {
    const {rounds, players} = useGame()
    const {gameId} = useParams()
    const dispatch = useGameDispatch()
    const navigate = useNavigate()

    const dataProcessor = () => {
        dispatch({
            type: actions.ADD_ROUNDS,
            payload: data
        })

        navigate(`../rounds/${data[0].round}`)
    }

    const [data, isProcessing, postData] = usePost(`/games/${gameId}/rounds`, dataProcessor)

    const roundList = useMemo(() => {
        const numRounds = rounds.length / players.length
        const roundsArray = []
        roundsArray.push(<NavLink className={'round-selector all-rounds-tab' } key={0} to={`../rounds/all`}>All</NavLink>)
        for (let i = 0; i < numRounds; i++) {
            const navLink = <NavLink className={'round-selector'} key={i + 1} to={`../rounds/${i + 1}`}>{i+1}</NavLink>
            roundsArray.push(navLink)
        }
        return roundsArray
    }, [rounds.length, players.length])

    const formHandler = async (event) => {
        event.preventDefault()
        postData()
    }

    return (
        <div id='round-container'>
            <div id='round-view' className="table-container">
                <h2>Round</h2>
                <div id='round-nav'>
                    {roundList}
                    <button 
                        className={'round-selector add-round-button' + (isProcessing ? ' processing' : '')}
                        onClick={formHandler}
                    >+</button>
                </div>
                <RoundsTable />
            </div>
            <SalesView/>
        </div>
    )
}