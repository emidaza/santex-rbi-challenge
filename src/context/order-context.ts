import { createContext, Dispatch } from 'react';
import { IOrderDispatch, Order } from '../models/order';

export const OrderContext = createContext<Order | null>(null);
export const OrderDispatchContext = createContext<Dispatch<IOrderDispatch> | null>(null);