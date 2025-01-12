import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Test component that uses cart context
const TestComponent = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, cartTotal } = useCart();
  
  return (
    <div>
      <div data-testid="cart-count">{items.length}</div>
      <div data-testid="cart-total">{cartTotal}</div>
      <button onClick={() => addItem({ id: '1', price: 10, name: 'Test Item' })}>
        Add Item
      </button>
      <button onClick={() => removeItem('1')}>Remove Item</button>
      <button onClick={() => updateQuantity('1', 2)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue('[]');
    mockLocalStorage.setItem.mockClear();
  });

  it('initializes with empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
  });

  it('adds item to cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Item'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('10');
  });

  it('removes item from cart', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
      { id: '1', price: 10, name: 'Test Item', quantity: 1 }
    ]));

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Remove Item'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
  });

  it('updates item quantity', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
      { id: '1', price: 10, name: 'Test Item', quantity: 1 }
    ]));

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Update Quantity'));

    expect(screen.getByTestId('cart-total')).toHaveTextContent('20');
  });

  it('clears cart', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
      { id: '1', price: 10, name: 'Test Item', quantity: 1 }
    ]));

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Clear Cart'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
  });

  it('persists cart state in localStorage', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Item'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ id: '1', price: 10, name: 'Test Item', quantity: 1 }])
    );
  });
}); 