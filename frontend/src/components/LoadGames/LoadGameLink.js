import {Link, useNavigate} from 'react-router-dom'
import './CardFormat.css'

const LoadGameLink = ({game}) => {
    const navigate = useNavigate();

    console.log(game)

    return (
            <li>
                <Link className='card-format' to={`${game.id}/rounds/all`}>
                    <div className='card-top'>
                        <h2>ID</h2>
                        <div>{game.id}</div>
                    </div>
                    <div className='card-bottom'>Players: {game.players.length}</div>
                </Link>
                    
            </li>
    )
}

export default LoadGameLink