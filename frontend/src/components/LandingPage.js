import { Link } from "react-router-dom"
import { cardChoices } from "./card-schemes"

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
    return (
        <>
            <ul className="card-list">
                <LandingPageLink
                    to={'games/create-game'}
                    cardScheme={cardChoices[0]}
                    title='Create Game'
                    description={'Start a new game'}
                    />
                <LandingPageLink 
                    to={'games'}
                    cardScheme={cardChoices[1]}
                    title={'Load Game'}
                    description={'Continue a previous game'}
                />
                <LandingPageLink 
                    to={'players/create-player'}
                    cardScheme={cardChoices[3]}
                    title={'Create Player'}
                    description={'Make a new player'}
                />
                <LandingPageLink 
                    to={'players'}
                    cardScheme={cardChoices[2]}
                    title={'View Players'}
                    description={'See all players'}
                />
            </ul>
        </>
    )
}

export default LandingPage