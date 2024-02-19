import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderContext, OrderDispatchContext } from '../../context/order-context';
import { ORDER } from '../../graphql/mutations';
import { IOrderDispatch, Order } from '../../models/order';
import { Asset, Product, ProductVariant } from '../../models/product';
import { ProductItem } from './ProductItem';

const productMock = {
  name: 'Test Product',
  id: '1',
  description: 'Test description',
  variants: [
    {
      price: '1000',
      id: '1',
    } as ProductVariant,
  ],
  featuredAsset: {
    name: 'Test picture',
    source: 'https://onepicture.server.com',
  } as Asset,
} as Product;

const mocks = [
  {
    delay: 20,
    request: {
      query: ORDER.ADD_ITEM_TO_ORDER,
      variables: {
        productVariantId: '1',
        quantity: 1,
      },
    },
    result: {
      data: {
        addItemToOrder: {
          __typename: 'Order',
          id: '1',
          active: true,
          totalQuantity: 1,
        },
      },
    },
  },
];

describe('ProductItem', () => {
  test('Component renders without errors', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductItem product={productMock}></ProductItem>
      </MockedProvider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('Component execute request and show loading when clicking buy button', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductItem product={productMock}></ProductItem>
      </MockedProvider>
    );
    userEvent.click(screen.getByText('Buy'));
    expect(
      await screen.findByRole('progressbar', { hidden: true })
    ).toBeInTheDocument();
  });

  test('Component execute request and show error snackbar when failing', async () => {
    const errorRequestMocks = [
      {
        request: {
          query: ORDER.ADD_ITEM_TO_ORDER,
          variables: {
            productVariantId: '1',
            quantity: 1,
          },
        },
        error: new Error('An error occurred'),
      },
    ];
    render(
      <MockedProvider mocks={errorRequestMocks} addTypename={false}>
        <ProductItem product={productMock}></ProductItem>
      </MockedProvider>
    );
    userEvent.click(screen.getByText('Buy'));
    const presetationEl = await screen.findByText("The product couldn't be added to the order. Please try again later");
    expect(presetationEl).toBeInTheDocument();
  });

  test('Component execute request and update context with new order when success', async () => {
    let order = {
      id: '1',
      active: true,
      totalQuantity: 1,
      state: 'active',
    } as Order;

    const mockSetOrder = jest.fn();
    mockSetOrder.mockImplementation((value: IOrderDispatch) => {
      expect(value.order?.totalQuantity).toBe(1);
    })
    render(
      <OrderContext.Provider value={order}>
        <OrderDispatchContext.Provider value={mockSetOrder}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <ProductItem product={productMock}></ProductItem>
          </MockedProvider>
        </OrderDispatchContext.Provider>
      </OrderContext.Provider>
    );
    userEvent.click(screen.getByText('Buy'));
  });
});
