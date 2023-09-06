import { Link } from "react-router-dom"

const LandingPage = () => {
    return (
        <>
            <ul>
                <li><Link to={'games/create-game'}>Create Game</Link></li>
                <li><Link to={'games'}>Load Game</Link></li>
                <li><Link to={'players'}>View Players</Link></li>
                <li><Link to={'create-player'}>Create Player</Link></li>
            </ul>
        </>
    )
}

export default LandingPage