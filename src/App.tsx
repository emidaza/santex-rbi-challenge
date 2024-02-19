import { Container } from '@mui/material';
import React, { useEffect, useReducer } from 'react';
import Header from './components/header/Header';
import ProductList from './components/product-list/ProductList';
import { ACTIVE_ORDER_KEY } from './constants/order-count-key.const';
import { OrderContext, OrderDispatchContext } from './context/order-context';
import useStateWithStorage from './hooks/useStateWithStorage';
import { Order } from './models/order';
import activeOrderReducer from './reducers/order.reducer';

function App() {
  const [value, setValue] = useStateWithStorage<Order | null>(ACTIVE_ORDER_KEY, null);
  const [order, setOrder] = useReducer(activeOrderReducer, value);

  useEffect(() => {
    setValue(order);
  }, [order, setValue]);

  return (
    <React.Fragment>
      <OrderContext.Provider value={order}>
        <OrderDispatchContext.Provider value={setOrder}>
          <Header></Header>
          <Container sx={{ py: 3 }}>
            <ProductList></ProductList>
          </Container>
        </OrderDispatchContext.Provider>
      </OrderContext.Provider>
    </React.Fragment>
  );
}

export default App;
