import RoundRow from "./RoundRow"
import { useGame } from "../GameContext"

const Rounds = () => {
    const rounds = useGame().rounds

    const rows = [];
    for (const [key, value] of Object.entries(rounds)) {
        rows.push(<RoundRow round={value} key={key} />)
    }

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
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </>

    )
}

export default Rounds