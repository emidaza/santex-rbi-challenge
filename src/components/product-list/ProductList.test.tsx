import { render, screen } from '@testing-library/react';
import ProductList from './ProductList';
import { MockedProvider } from '@apollo/client/testing';
import { PRODUCTS } from '../../graphql/queries';
import { Asset, Product, ProductVariant } from '../../models/product';
import userEvent from '@testing-library/user-event';

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

describe('ProductList', () => {
  test('Component renders without errors', async () => {
    const mocks = [
      {
        delay: 20,
        request: {
          query: PRODUCTS.GET_PRODUCTS,
          variables: {
            take: 20,
            skip: 0,
          },
        },
        result: {
          data: {
            products: {
              totalItems: 1,
              items: [productMock],
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductList></ProductList>
      </MockedProvider>
    );
    expect(
      await screen.findByRole('progressbar', { hidden: true })
    ).toBeInTheDocument();
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(await screen.findAllByRole('img')).toHaveLength(1);
  });

  test('Component show error when request fails', async () => {
    const mocks = [
      {
        request: {
          query: PRODUCTS.GET_PRODUCTS,
          variables: {
            take: 20,
            skip: 0,
          },
        },
        error: new Error('An error occurred'),
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductList></ProductList>
      </MockedProvider>
    );
    expect(
      await screen.findByText(
        'There was an error loading the product lists, please try again later'
      )
    ).toBeInTheDocument();
  });

  test('Component paginator request the correct page', async () => {
    const secondProduct = {
      ...productMock,
      name: 'Test Product 2',
    };
    const mocks = [
      {
        request: {
          query: PRODUCTS.GET_PRODUCTS,
          variables: {
            take: 20,
            skip: 0,
          },
        },
        result: {
          data: {
            products: {
              totalItems: 40,
              items: [productMock],
            },
          },
        },
      },
      {
        request: {
          query: PRODUCTS.GET_PRODUCTS,
          variables: {
            take: 20,
            skip: 20,
          },
        },
        result: {
          data: {
            products: {
              totalItems: 40,
              items: [secondProduct],
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductList></ProductList>
      </MockedProvider>
    );

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    userEvent.click(screen.getByText('2'));
    expect(await screen.findByText('Test Product 2')).toBeInTheDocument();
  });
});
