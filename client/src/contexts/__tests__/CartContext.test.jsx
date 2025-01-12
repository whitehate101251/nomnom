import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { mockProduct } from '../../utils/test-utils';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides initial empty cart state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('loads cart from localStorage on mount', () => {
    const savedCart = [{ ...mockProduct, quantity: 2 }];
    localStorage.setItem('cart', JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cartItems).toEqual(savedCart);
    expect(result.current.total).toBe(mockProduct.price * 2);
    expect(result.current.itemCount).toBe(2);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cartItems).toContainEqual({ ...mockProduct, quantity: 1 });
    expect(result.current.total).toBe(mockProduct.price);
    expect(result.current.itemCount).toBe(1);

    // Verify localStorage update
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    expect(savedCart).toContainEqual({ ...mockProduct, quantity: 1 });
  });

  it('increases quantity of existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cartItems).toContainEqual({ ...mockProduct, quantity: 2 });
    expect(result.current.total).toBe(mockProduct.price * 2);
    expect(result.current.itemCount).toBe(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.cartItems).not.toContainEqual(mockProduct);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);

    // Verify localStorage update
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    expect(savedCart).not.toContainEqual(mockProduct);
  });

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(mockProduct.id, 3);
    });

    expect(result.current.cartItems[0].quantity).toBe(3);
    expect(result.current.total).toBe(mockProduct.price * 3);
    expect(result.current.itemCount).toBe(3);
  });

  it('removes item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(mockProduct.id, 0);
    });

    expect(result.current.cartItems).not.toContainEqual(mockProduct);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2 });
      result.current.clearCart();
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);

    // Verify localStorage update
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    expect(savedCart).toEqual([]);
  });

  it('handles invalid localStorage data', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('cart', 'invalid-json');

    const { result } = renderHook(() => useCart(), { wrapper });

    // Should initialize with empty cart
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('updates localStorage when adding items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    const savedCart = JSON.parse(localStorage.getItem('cart'));
    expect(savedCart).toEqual([{ ...mockProduct, quantity: 1 }]);
  });

  it('updates localStorage when removing items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.removeFromCart(mockProduct.id);
    });

    const savedCart = JSON.parse(localStorage.getItem('cart'));
    expect(savedCart).toEqual([]);
  });

  it('maintains cart state between re-renders', () => {
    const { result, rerender } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    rerender();

    expect(result.current.cartItems).toContainEqual({ ...mockProduct, quantity: 1 });
    expect(result.current.total).toBe(mockProduct.price);
    expect(result.current.itemCount).toBe(1);
  });

  it('calculates total correctly with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const secondProduct = { ...mockProduct, id: 2, price: 29.99 };

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
      result.current.addToCart(secondProduct);
    });

    const expectedTotal = (mockProduct.price * 2) + secondProduct.price;
    expect(result.current.total).toBe(expectedTotal);
    expect(result.current.itemCount).toBe(3);
  });

  it('prevents negative quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(mockProduct.id, -1);
    });

    expect(result.current.cartItems).not.toContainEqual(mockProduct);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('handles decimal quantities as integers', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(mockProduct.id, 2.5);
    });

    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.total).toBe(mockProduct.price * 2);
    expect(result.current.itemCount).toBe(2);
  });
}); 