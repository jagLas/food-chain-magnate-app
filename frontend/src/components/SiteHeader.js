import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './SiteHeader.css'
import LogoutButton from './LogoutButton'
import { useUserContext } from '../App'

export default function SiteHeader () {
    const { isAuthenticated } = useUserContext()
    const {pathname} = useLocation()
    const navigate=useNavigate()
    
    const onClickHandler = () => {
        navigate('')
    }

    console.log(pathname)

    return (
        <div id='site-header'>
            <div className='App-logo' onClick={onClickHandler}></div>
            <div className='logo-bar'></div>
            <div id='site-title'>
                <h1>Food Chain Magnate Helper</h1>
                {isAuthenticated ? <LogoutButton /> : false}
            </div>
            {pathname !== '/' && <div className='navbar'>
                <NavLink to='/'>Home</NavLink>
                <NavLink  to='/games/create-game'>Create Games</NavLink>
                <NavLink to='/games' end>View Games</NavLink>
                <NavLink to='/players' end>View Players</NavLink>
                <NavLink to='/players/create-player'>Create Players</NavLink>
            </div>}
        </div>

    )
}