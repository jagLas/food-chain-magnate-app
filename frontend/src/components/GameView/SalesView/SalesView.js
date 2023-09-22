import SaleRow from "./SaleRow";
import AddSaleForm from "../Totals/AddSaleForm";
import { useGame } from "../GameContext/GameContext";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import './SaleView.css'

function salesSortingFunc(a, b) {
    let x = a.props.sale
    let y = b.props.sale

    if (x.sale_id < y.sale_id) {
        return 1
    } 
    
    if (x.sale_id < y.sale_id) {
        return 1
    }

    else {
        return 0
    }
}

export default function SalesView() {
    const sales = useGame().sales
    const {roundNum} = useParams()

    const rows = useMemo(() => {
        const rows = [];
        for (const sale of sales) {
            rows.push(<SaleRow sale={sale} key={sale.sale_id} />)
        }

        // sorts sales by sale_id descending so most recent shows up at the top
        rows.sort(salesSortingFunc)

        if (roundNum === 'all') {
            return rows
        }

        return rows.filter(row => {
            return row.props.sale.round === parseInt(roundNum)
          })
    },[sales, roundNum])


    return (
        <div id='sale-view' className="table-container">
            <h2>Sales</h2>
            {roundNum !== 'all' ? <AddSaleForm / > : null}
            <div id="sales-table" className="table">
                <div className="table-row header">
                    <div className="table-subgroup">Name</div>
                    <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                        <div>Round</div>
                        <div>House</div>
                        <div>Garden</div>
                        <div>Burgers</div>
                        <div>Pizzas</div>
                        <div>Drinks</div>
                    </div>
                    <div className="table-subgroup sale-optional-calcs" style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                        <div>Unit Price</div>
                        <div>Base Revenue</div>
                        <div>Garden Bonus</div>
                        <div>Burger Bonus</div>
                        <div>Pizza Bonus</div>
                        <div>Drink Bonus</div>
                    </div>
                    <div className="table-subgroup">Sale Total</div>
                    <div className="table-subgroup"></div>
                </div>
                {rows}
            </div>
        </div>
    )
}