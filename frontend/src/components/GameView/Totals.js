import { useState, useEffect } from "react"
import TotalRow from "./TotalRow"
import { useParams } from "react-router-dom"

const Totals = () => {

    const [incomeSummary, setIncomeSummary] = useState({})
    const {gameId} = useParams()

    const getData = async () => {
      let data = await fetch(`http://host.docker.internal:5000/games/${gameId}/player_totals`)
  
      data = await data.json()
      setIncomeSummary(data)
    }
  
    useEffect(()=>{
      getData()
    },[])


    const rows = [];
    for (const [key, value] of Object.entries(incomeSummary)) {
        rows.push(<TotalRow obj={value} key={key} />)
    }

    return (
      <>
        <h2>Game Summary</h2>
        <table id='total-summary'>
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Income</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </>

    )
}

export default Totals