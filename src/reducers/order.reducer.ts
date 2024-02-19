import { OrderDispatchTypes } from "../enums/order-context.enum";
import { IOrderDispatch, Order } from "../models/order";

export default function activeOrderReducer(order: Order | null, action: IOrderDispatch) {
    switch (action.type) {
        case OrderDispatchTypes.UpsertOrder:
            order = action.order;
            return order;
        case OrderDispatchTypes.ValidateActiveOrder:
            if (action.order && action.order.id !== order?.id) {
                return action.order;
            } else if (!action.order) {
                return null
            }
            return order;
        default:
            throw Error('Unknown action: ' + action.type);
    }
}