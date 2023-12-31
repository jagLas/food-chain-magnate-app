import RoundRow from "./RoundRow"
import { useGame } from "../GameContext/GameContext"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

export default function RoundsTable(){
    const rounds = useGame().rounds
    const {roundNum} = useParams()

    const rows = useMemo(() => {
      const rows = [];

      for (const value of rounds) {
          rows.push(<RoundRow round={value} key={value.round_id} />)
      }

      if (roundNum === 'all') {
        return rows
      }

      return rows.filter(row => {
        return row.props.round.round === parseInt(roundNum)
      })
    }, [rounds, roundNum])

    return (
      <div id='rounds-table' className="table">
        <div className="table-row header">
          <div className="table-subgroup">Name</div>
          <div className="table-subgroup milestones" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
            <div>First Burger</div>
            <div>First Pizza</div>
            <div>First Drink</div>
            <div>First Waitress</div>
            <div>CFO</div>
          </div>
          <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
            <div>Unit Price</div>
            <div>Waitresses</div>
            <div>Salaries Paid</div>
          </div>
          <div className="table-subgroup optional-calcs" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
            <div>Waitress Income</div>
            <div>Sales Revenue</div>
            <div>CFO Bonus</div>
            <div>Round Revenue</div>
          </div>
          <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
            <div>Salaries Expense</div>
            <div style={{fontWeight: 700}}>Round Income</div>
          </div>
        </div>

        {rows}
        
      </div>
    )
}