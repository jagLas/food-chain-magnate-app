import { useParams } from "react-router-dom";
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { actions } from "./GameContext/GameReducer"

export default function SaleRow({sale}) {
    const dispatch = useGameDispatch();
    const {gameId} = useParams();
    const {players} = useGame();

    const deleteSale = async () => {
        console.log(sale.sale_id)
        let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/sales/${sale.sale_id}`,{
            method: 'DELETE'
        });

        data = await data.json();

        dispatch({
            type: actions.DELETE_SALE,
            payload: sale.sale_id
        })

        dispatch({
            type: actions.UPDATE_ROUND,
            payload: data
        })
    }

    return (
        <div className="table-row">
            <div className="player-name-field">
                {players.find(player => player.id === sale.player_id).name}
            </div>
            <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                <div className="round-field">
                    <label>Round</label>
                    {sale.round}
                </div>
                <div className="round-field">
                    <label>House</label>
                    {sale.house_number}
                </div>
                <div className="round-field">
                    <label for={'garden-' + sale.sale_id}>Garden</label>
                    {sale.garden ?
                        <input id={'garden-' + sale.sale_id} readOnly={true} checked={true} type="checkbox"/> :
                        <input id={'garden-' + sale.sale_id} readOnly={true} checked={false} type="checkbox"/>
                    }
                </div>
                <div className="round-field">
                    <label>Burgers</label>
                    {sale.burgers}
                </div>
                <div className="round-field">
                    <label>Pizzas</label>
                    {sale.pizzas}
                </div>
                <div className="round-field">
                    <label>Drinks</label>
                    {sale.drinks}
                </div>
            </div>
            <div className="table-subgroup sale-optional-calcs"  style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                <div className="round-field">
                    <label>Unit Price</label>{sale.unit_price}</div>
                    <div className="round-field">
                    <label>Base Revenue</label>{sale.base_revenue}</div>
                    <div className="round-field">
                    <label>Garden Bonus</label>{sale.garden_bonus}</div>
                    <div className="round-field">
                    <label>Burger Bonus</label>{sale.burger_bonus}</div>
                    <div className="round-field">
                    <label>Pizza Bonus</label>{sale.pizza_bonus}</div>
                    <div className="round-field">
                    <label>Drink Bonus</label>{sale.drink_bonus}</div>
            </div>
            <div className="table-subgroup">
                <div className="round-field">
                    <label className="single-row-label">Sale Total</label>{sale.sale_total}
                </div>
            </div>
            <div className="table-subgroup" style={{padding: '4px'}}>
                <button
                    className="delete-sale"
                    onClick={deleteSale}
                >
                    delete
                </button>
            </div>
        </div>
    )
}