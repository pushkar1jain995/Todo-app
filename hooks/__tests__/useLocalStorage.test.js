import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
  let mockStorage = {};
  
  // Setup mock storage before all tests
  beforeAll(() => {
    global.Storage.prototype.getItem = jest.fn(
      (key) => mockStorage[key] ? mockStorage[key] : null
    );
    global.Storage.prototype.setItem = jest.fn(
      (key, value) => { mockStorage[key] = value; }
    );
    global.Storage.prototype.clear = jest.fn(
      () => { mockStorage = {}; }
    );
  });

  // Clear mock storage before each test
  beforeEach(() => {
    mockStorage = {};
    jest.clearAllMocks();
  });

  it('should initialize with the provided initial value when no stored value exists', () => {
    const initialValue = { todos: [] };
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    expect(result.current[0]).toEqual(initialValue);
    expect(global.Storage.prototype.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should return stored value when it exists in localStorage', () => {
    const storedValue = { todos: [{ id: 1, text: 'Test Todo' }] };
    mockStorage.testKey = JSON.stringify(storedValue);

    const { result } = renderHook(() => useLocalStorage('testKey', { todos: [] }));
    
    expect(result.current[0]).toEqual(storedValue);
  });

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', { todos: [] }));
    const newValue = { todos: [{ id: 1, text: 'New Todo' }] };
    
    act(() => {
      result.current[1](newValue);
    });

    expect(global.Storage.prototype.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify(newValue)
    );
    expect(result.current[0]).toEqual(newValue);
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.Storage.prototype.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    const initialValue = { todos: [] };
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));

    expect(result.current[0]).toEqual(initialValue);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle invalid JSON in localStorage', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockStorage.testKey = 'invalid-json';

    const initialValue = { todos: [] };
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));

    expect(result.current[0]).toEqual(initialValue);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should update state with function updates', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', { count: 0 }));

    act(() => {
      result.current[1](prev => ({ count: prev.count + 1 }));
    });

    expect(result.current[0]).toEqual({ count: 1 });
    expect(global.Storage.prototype.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify({ count: 1 })
    );
  });
}); 