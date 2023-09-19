import { useNavigate } from 'react-router-dom'
import './SiteHeader.css'

export default function SiteHeader () {
    const navigate=useNavigate()
    
    const onClickHandler = () => {
        navigate('')
    }

    return (
        <div id='site-header'>
            <div className='App-logo' onClick={onClickHandler}></div>
            <div className='logo-bar'></div>
            <div id='site-title'>
                <h1>Food Chain Magnate Helper</h1>
            </div>
            
        </div>

    )
}