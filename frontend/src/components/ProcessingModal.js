export default function ProcessingModal () {
    return (
        <div
            className="modal"
            style={{
                backgroundColor: 'rgba(255, 248, 219, .4)',
                zIndex: '21'
            }}
        >
            <div className='loading'
                style={{
                    opacity: 1
                }}
            >
                <div className='sign' style={{backgroundColor: 'rgba(255, 248, 219, .8)'}}>
                    <h2>Processing</h2>
                    <div>Your Data:</div>
                    <div>Coming Soon!</div>
                </div>
                <div className='sign-post'></div>
            </div>
        </div>
    
    )
}