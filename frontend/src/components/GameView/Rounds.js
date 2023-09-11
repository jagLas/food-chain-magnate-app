import RoundRow from "./RoundRow"
import { useGame } from "../GameContext"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

const Rounds = () => {
    const rounds = useGame().rounds
    const {roundNum} = useParams()

    const rows = useMemo(() => {
      const rows = [];

      rounds.sort((a,b)=> {
        return a.player_name > b.player_name
      })

      for (const [key, value] of Object.entries(rounds)) {
          rows.push(<RoundRow round={value} key={key} />)
      }

      if (roundNum === 'all') {
        return rows
      }

      return rows.filter(row => {
        return row.props.round.round === parseInt(roundNum)
      })
    }, [rounds, roundNum])

    return (
      <>
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
              <th>Waitress Income</th>
              <th>Sales Revenue</th>
              <th>cfo bonus</th>
              <th>Round Revenue</th>
              <th>Salaries Expense</th>
              <th>Round Income</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </>

    )
}

export default Rounds