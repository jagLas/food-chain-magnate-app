export default function ProcessingModal () {
    return (
        <div
            className="modal"
            style={{
                backgroundColor: 'rgba(100, 97, 86, .7)'
            }}
        >
            <div className='loading'
                style={{
                    opacity: 1
                }}
            >
                <div className='sign'>
                    <h2>Processing</h2>
                    <div>Your Data:</div>
                    <div>Coming Soon!</div>
                </div>
                <div className='sign-post'></div>
            </div>
        </div>
    
    )
}