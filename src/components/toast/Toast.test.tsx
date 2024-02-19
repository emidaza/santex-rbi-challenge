import { render, screen } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  test('Toast renders without crashing', () => {
    render(<Toast show={false}></Toast>);
  });

  test('Toast is shown with default message', () => {
    render(<Toast show={true}></Toast>);
    const defaultMessage = screen.getByText(
      'There was an error processing your request'
    );
    expect(defaultMessage).not.toBeUndefined();
  });

  test('Toast is shown with passed message', () => {
    render(<Toast show={true} message={'Test message'}></Toast>);
    const defaultMessage = screen.getByText('Test message');
    expect(defaultMessage).not.toBeUndefined();
  });

  test('Toast is not shown when show is false', () => {
    render(<Toast show={false} message={'Test message'}></Toast>);
    const defaultMessage = screen.queryByText('Test message');
    expect(defaultMessage).toBeNull();
  });
});
