export const actions = {
    FETCH_DATA: 'FETCH_DATA',
    ADD_SALE: 'ADD_SALE'
}

export default function gameReducer(game, action) {
    const {type, payload} = action
    switch (type) {
        case actions.FETCH_DATA:
            return {
                rounds: payload.roundData,
                sales: payload.salesData,
                totals: payload.totalsData,
                players: payload.playersData
            }
        case actions.ADD_SALE:
            return {
                ...game,
                sales: [...game.sales, payload]
            }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}