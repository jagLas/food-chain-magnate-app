import { useEffect, useMemo, useState} from 'react'
import LoadGameLink from './LoadGameLink'
import { CardColor } from '../../utilities/card-schemes'
import { authFetch } from '../../utilities/auth'
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading'


const LoadGames = () => {
    const [games, setGames] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchGames () {
            console.log('fetching games')
            setIsLoading(true)
            try{
                let data = await authFetch('/games/')
                setGames(data)
            } catch(error){
                navigate('/error', {state: { ...error }})
            }
            setIsLoading(false)
        }
    
        fetchGames()
    }, [navigate])

    const rows = useMemo(()=> {
        const rows = []
    
        for (const [key, game] of Object.entries(games)) {
            rows.push(
                <LoadGameLink
                    key={game.id}
                    cardScheme={CardColor.getCardScheme(key)}
                    game={game}
                />
            )
        }
        return rows
    }, [games])

    return (
        <div id='load-games'>
            <h2 className='menu-header'>Games</h2>
            {isLoading ? <Loading /> : 
            <ul className='card-list'>
                {rows}
                {!rows.length && <h3>You do not currently have any games!</h3>}
            </ul>}
            <button
                className='menu-button'
                onClick={() => navigate('create-game')}
            >Create a Game</button>
        </div>
    )
}

export default LoadGames