import { act, renderHook } from '@testing-library/react-hooks';
import useStateWithStorage from './useStateWithStorage';

describe('useStateWithStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the default value and update localStorage when key does not exist', () => {
    const { result } = renderHook(() => useStateWithStorage('test', 'default'));

    expect(result.current[0]).toBe('default');
    expect(localStorage.getItem('test')).toBe('"default"');
  });

  it('should return the value from localStorage when key exists', () => {
    localStorage.setItem('test', JSON.stringify('stored'));
    const { result } = renderHook(() => useStateWithStorage('test', 'default'));

    expect(result.current[0]).toBe('stored');
  });

  it('should update the value and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useStateWithStorage('test', 'default'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test')).toBe('"updated"');
  });

  it('should handle JSON parsing errors and return undefined', () => {
    localStorage.setItem('test', 'invalid JSON');
    const { result } = renderHook(() => useStateWithStorage('test', 'default'));

    expect(result.current[0]).toBeUndefined();
  });
});
