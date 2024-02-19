import { useQuery } from '@apollo/client/';
import { ShoppingCart } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { useContext, useEffect } from 'react';
import { OrderDispatchTypes } from '../../enums/order-context.enum';
import {
  OrderContext,
  OrderDispatchContext,
} from '../../context/order-context';
import { ORDERS } from '../../graphql/queries';
import { GqlQueryResponse } from '../../models/gql-base';
import { Order } from '../../models/order';
import { OrderGqlOperations } from '../../enums/order-gql-operations.enum';

export default function OrderCart() {
  const order = useContext(OrderContext);
  const setOrder = useContext(OrderDispatchContext);
  const { data } = useQuery<
    GqlQueryResponse<Order, OrderGqlOperations.ActiveOrder>
  >(ORDERS.ACTIVE_ORDER);

  useEffect(() => {
    if (setOrder !== null && data) {
      setOrder({
        type: OrderDispatchTypes.ValidateActiveOrder,
        order: data.activeOrder,
      });
    }
  }, [setOrder, data]);

  if (order === null) return <ShoppingCart />;
  return (
    <Badge badgeContent={order?.totalQuantity} color="primary">
      <ShoppingCart />
    </Badge>
  );
}
