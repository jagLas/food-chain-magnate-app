export default function SaleRow({sale}) {
    return (
        <tr>
            <td>{sale.round}</td>
            <td>{sale.player_id}</td>
            <td>{sale.house_number}</td>
            <td>{sale.garden ? 'X' : ' '}</td>
            <td>{sale.burgers}</td>
            <td>{sale.pizzas}</td>
            <td>{sale.drinks}</td>
            <td>{sale.unit_price}</td>
            <td>{sale.base_revenue}</td>
            <td>{sale.garden_bonus}</td>
            <td>{sale.burger_bonus}</td>
            <td>{sale.pizza_bonus}</td>
            <td>{sale.drink_bonus}</td>
            <td>{sale.sale_total}</td>
        </tr>
    )
}