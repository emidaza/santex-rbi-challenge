import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  OrderContext,
  OrderDispatchContext,
} from '../../context/order-context';
import { OrderDispatchTypes } from '../../enums/order-context.enum';
import { OrderGqlOperations } from '../../enums/order-gql-operations.enum';
import { ORDERS } from '../../graphql/queries';
import { GqlQueryResponse } from '../../models/gql-base';
import { IOrderDispatch, Order } from '../../models/order';
import OrderCart from './OrderCart';

const orderMock = {
  id: '1',
  active: true,
  totalQuantity: 5,
} as Order;

const mocks = [
  {
    request: {
      query: ORDERS.ACTIVE_ORDER,
    },
    result: {
      data: {
        activeOrder: orderMock,
      } as GqlQueryResponse<Order, OrderGqlOperations.ActiveOrder>,
    },
  },
];

describe('OrderCart', () => {
  it('Component renders without errors', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OrderCart></OrderCart>
      </MockedProvider>
    );
    expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
  });

  it('should shows badge with quantity', async () => {
    render(
      <OrderContext.Provider value={orderMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <OrderCart></OrderCart>
        </MockedProvider>
      </OrderContext.Provider>
    );
    expect(await screen.findByText('5')).toBeInTheDocument();
  });

  it('should shows quantity if active order is in the query response', async () => {
    const mockSetOrder = jest.fn();
    mockSetOrder.mockImplementation((value: IOrderDispatch) => {
      if (value.type === OrderDispatchTypes.ValidateActiveOrder) {
        rerender(
          <OrderContext.Provider value={value.order}>
            <OrderDispatchContext.Provider value={mockSetOrder}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <OrderCart></OrderCart>
              </MockedProvider>
            </OrderDispatchContext.Provider>
          </OrderContext.Provider>
        );
      }
    });
    const { rerender } = render(
      <OrderContext.Provider value={null}>
        <OrderDispatchContext.Provider value={mockSetOrder}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <OrderCart></OrderCart>
          </MockedProvider>
        </OrderDispatchContext.Provider>
      </OrderContext.Provider>
    );
    expect(await screen.findByText('5')).toBeInTheDocument();
  });

  it('should clean storage and doesn"t show quantity if no active order is received on init', async () => {
    const mocks = [
      {
        request: {
          query: ORDERS.ACTIVE_ORDER,
        },
        result: {
          data: {
            activeOrder: null,
          } as GqlQueryResponse<Order | null, OrderGqlOperations.ActiveOrder>,
        },
      },
    ];
    const mockSetOrder = jest.fn();
    mockSetOrder.mockImplementation((value: IOrderDispatch) => {
      if (value.type === OrderDispatchTypes.ValidateActiveOrder) {
        rerender(
          <OrderContext.Provider value={value.order}>
            <OrderDispatchContext.Provider value={mockSetOrder}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <OrderCart></OrderCart>
              </MockedProvider>
            </OrderDispatchContext.Provider>
          </OrderContext.Provider>
        );
      }
    });
    const { rerender } = render(
      <OrderContext.Provider value={orderMock}>
        <OrderDispatchContext.Provider value={mockSetOrder}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <OrderCart></OrderCart>
          </MockedProvider>
        </OrderDispatchContext.Provider>
      </OrderContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });
});
