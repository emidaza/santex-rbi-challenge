import { OrderDispatchTypes } from "../enums/order-context.enum";

export interface Order {
  id: string;
  totalQuantity: number;
  state: string;
  active: boolean;
}

export interface IOrderDispatch {
  type: OrderDispatchTypes;
  order: Order | null;
}
