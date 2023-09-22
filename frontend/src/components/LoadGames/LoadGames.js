import {useEffect, useMemo, useState} from 'react'
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
            console.error(error)
            if (error.statusCode === 401) {
                navigate('/')
            }
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
        <>
            <ul className='card-list'>
                {rows}
            </ul>
        </>
    )
}

export default LoadGames