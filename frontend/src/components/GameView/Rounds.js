import { useState, useEffect } from "react"
import RoundRow from "./RoundRow"
import { useParams } from "react-router-dom"

const Rounds = () => {
    const [rounds, setRounds] = useState([])
    const {gameId} = useParams()



    useEffect(() => {
      const fetchRounds = async () => {
        try{
          let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/rounds`)
  
          data = await data.json()
          setRounds(data)
        } catch(error) {
          console.log(error)
        }
      }
      
      fetchRounds()
    },[gameId])

    const rows = [];
    for (const [key, value] of Object.entries(rounds)) {
        rows.push(<RoundRow round={value} key={key} />)
    }

    return (
      <>
        <h2>Round Summary</h2>
        <table id='total-summary'>
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>CFO</th>
              <th>First Burger</th>
              <th>First Pizza</th>
              <th>First Drink</th>
              <th>First Waitress</th>
              <th>Unit Price</th>
              <th>Waitresses</th>
              <th>Salaries Paid</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </>

    )
}

export default Rounds