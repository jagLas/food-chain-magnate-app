import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './SiteHeader.css'
import LogoutButton from './LogoutButton'
import { useUserContext } from '../App'

export default function SiteHeader () {
    const { isAuthenticated } = useUserContext()
    const navigate=useNavigate()
    
    const onClickHandler = () => {
        navigate('')
    }

    return (
        <div id='site-header'>
            <div className='App-logo' onClick={onClickHandler}></div>
            <div className='header-main'>
                
                <div id='site-title'>
                    <h1>Food Chain Magnate Helper</h1>
                    {isAuthenticated ? <LogoutButton /> : false}
                    <div className='logo-bar'></div>
                </div>
                <div className='navbar'>
                {isAuthenticated && <>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink  to='/games/create-game'>Create Game</NavLink>
                    <NavLink to='/games' end>View Games</NavLink>
                    <NavLink to='/players/create-player'>Create Player</NavLink>
                    <NavLink to='/players' end>View Players</NavLink>
                    </>}
                </div>
            </div>
        </div>

    )
}