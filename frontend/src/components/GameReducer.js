export const actions = {
    FETCH_DATA: 'FETCH_DATA'
}

export default function gameReducer(game, action) {
    const {type, payload} = action
    switch (type) {
        case actions.FETCH_DATA:
            return {
                rounds: payload.roundData,
                sales: payload.salesData,
                totals: payload.totalsData
            }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}