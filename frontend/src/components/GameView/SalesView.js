import { useState, useEffect } from "react"
import SaleRow from "./SaleRow";
import AddSaleForm from "./AddSaleForm";

export default function SalesView() {
    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
        let data = await fetch('http://host.docker.internal:5000/games/1/sales')

        data = await data.json()
        setSales(data)
    }

    useEffect(() => {
        fetchSales()
    },[])
    
    const rows = [];
    for (const [key, value] of Object.entries(sales)) {
        rows.push(<SaleRow sale={value} key={key} />)
    }

    return (
        <div id='sale-view'>
            <h2>Sales</h2>
            <AddSaleForm />
            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Player Id</th>
                        <th>House #</th>
                        <th>Garden</th>
                        <th>Burgers</th>
                        <th>Pizzas</th>
                        <th>Drinks</th>
                        <th>Unit Price</th>
                        <th>Base Revenue</th>
                        <th>Garden Bonus</th>
                        <th>Burger Bonus</th>
                        <th>Pizza Bonus</th>
                        <th>Drink Bonus</th>
                        <th>Sale Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}