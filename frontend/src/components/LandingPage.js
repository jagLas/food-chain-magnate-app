import { Link } from "react-router-dom"
import { CardColor } from "./card-schemes"
import Login from "./Login"
import { useUserContext } from "../App"

const LandingPageLink = ({to, cardScheme, title, description}) => {
    return (
        <li>
            <Link className="card-format" to={to}
                style={{
                    "--card-color": cardScheme.background,
                    "--card-text-color": cardScheme.text
                }}
            >
                <div className="card-top"><h2>{title}</h2></div>
                <div className="card-bottom">{description}</div>
            </Link>
        </li>
    )
}

const LandingPage = () => {
    const { isAuthenticated } = useUserContext()

    if (!isAuthenticated) {
        return <Login/>
    }

    return (
        <>
            <ul className="card-list">
                <LandingPageLink
                    to={'games/create-game'}
                    cardScheme={CardColor.getCardScheme(0)}
                    title='Create Game'
                    description={'Start a new game'}
                    />
                <LandingPageLink 
                    to={'games'}
                    cardScheme={CardColor.getCardScheme(1)}
                    title={'Load Game'}
                    description={'Continue a previous game'}
                />
                <LandingPageLink 
                    to={'players/create-player'}
                    cardScheme={CardColor.getCardScheme(3)}
                    title={'Create Player'}
                    description={'Make a new player'}
                />
                <LandingPageLink 
                    to={'players'}
                    cardScheme={CardColor.getCardScheme(2)}
                    title={'View Players'}
                    description={'See all players'}
                />
            </ul>
            <Login />
        </>
    )
}

export default LandingPage