const TotalRow = ({row}) => {

    return (
        <div className='table-row'>
            <div style={{fontWeight: '600'}}>{row.name}</div>
            {/* <div>{row.revenue}</div>
            <div>{-row.expenses}</div> */}
            <div>{row.income}</div>
        </div>
    )
}

export default TotalRow