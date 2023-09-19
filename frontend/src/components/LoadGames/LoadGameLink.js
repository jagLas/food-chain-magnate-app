import {Link} from 'react-router-dom'

const LoadGameLink = ({game, cardScheme}) => {
    return (
            <li>
                <Link className='card-format' to={`${game.id}/rounds/all`}
                    style={{
                        "--card-color": cardScheme.background,
                        "--card-text-color": cardScheme.text
                    }}
                >
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