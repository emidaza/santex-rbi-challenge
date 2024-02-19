import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/product-list/ProductList', () => () => (
  <div data-testid="product-list">ProductList</div>
));

jest.mock('./components/header/Header', () => () => (
  <div data-testid="header">Header</div>
));

describe('App', () => {
  it('Renders correctly', async () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });
});
