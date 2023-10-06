import './Loading.css'

export default function Loading({message}) {
    return (
        <div className='loading'>
            <div className='sign'>
                <h2>{message ? message : 'Loading'}</h2>
                <div>Your Data:</div>
                <div>Coming Soon!</div>
            </div>
            <div className='sign-post'></div>
        </div>
    )
}