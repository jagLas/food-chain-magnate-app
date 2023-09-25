import { useEffect, useMemo, useState} from 'react'
import LoadGameLink from './LoadGameLink'
import { CardColor } from '../../utilities/card-schemes'
import { authFetch } from '../../utilities/auth'
import { useNavigate } from 'react-router-dom'


const LoadGames = () => {
    const [games, setGames] = useState([])
    const navigate = useNavigate()

    const fetchGames = async () => {
        try{
            let data = await authFetch('/games')
            setGames(data)
        } catch(error){
            navigate('/error', {state: { ...error }})
        }
    }

    useEffect(() => {
        fetchGames()
    }, [])

    const rows = useMemo(()=> {
        const rows = []
    
        for (const [key, game] of Object.entries(games)) {
            rows.push(
                <LoadGameLink key={game.id} cardScheme={CardColor.getCardScheme(key)} game={game} />
            )
        }
        return rows
    }, [games])

    return (
        <div id='load-games'>
            <h2 className='menu-header'>Load Games</h2>
            <ul className='card-list'>
                {rows}
            </ul>
            {!rows.length && <h3>You do not currently have any games!</h3>}
            <button
                className='menu-button'
                onClick={() => navigate('create-game')}
            >Create a Game</button>
        </div>
    )
}

export default LoadGames