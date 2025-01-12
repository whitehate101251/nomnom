import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { WishlistProvider, useWishlist } from '../WishlistContext';
import { mockProduct } from '../../utils/test-utils';

const wrapper = ({ children }) => <WishlistProvider>{children}</WishlistProvider>;

describe('WishlistContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides initial empty wishlist state', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlistItems).toEqual([]);
    expect(result.current.isInWishlist(mockProduct.id)).toBe(false);
  });

  it('loads wishlist from localStorage on mount', () => {
    const savedWishlist = [mockProduct];
    localStorage.setItem('wishlist', JSON.stringify(savedWishlist));

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlistItems).toEqual(savedWishlist);
    expect(result.current.isInWishlist(mockProduct.id)).toBe(true);
  });

  it('adds item to wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    expect(result.current.wishlistItems).toContainEqual(mockProduct);
    expect(result.current.isInWishlist(mockProduct.id)).toBe(true);

    // Verify localStorage update
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    expect(savedWishlist).toContainEqual(mockProduct);
  });

  it('removes item from wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    // First add an item
    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    // Then remove it
    act(() => {
      result.current.removeFromWishlist(mockProduct.id);
    });

    expect(result.current.wishlistItems).not.toContainEqual(mockProduct);
    expect(result.current.isInWishlist(mockProduct.id)).toBe(false);

    // Verify localStorage update
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    expect(savedWishlist).not.toContainEqual(mockProduct);
  });

  it('clears wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    // Add multiple items
    act(() => {
      result.current.addToWishlist(mockProduct);
      result.current.addToWishlist({ ...mockProduct, id: 2 });
    });

    // Clear wishlist
    act(() => {
      result.current.clearWishlist();
    });

    expect(result.current.wishlistItems).toEqual([]);
    expect(result.current.isInWishlist(mockProduct.id)).toBe(false);

    // Verify localStorage update
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    expect(savedWishlist).toEqual([]);
  });

  it('prevents duplicate items in wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
      result.current.addToWishlist(mockProduct); // Try to add the same product again
    });

    expect(result.current.wishlistItems.length).toBe(1);
    expect(result.current.wishlistItems[0]).toEqual(mockProduct);
  });

  it('handles invalid localStorage data', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('wishlist', 'invalid-json');

    const { result } = renderHook(() => useWishlist(), { wrapper });

    // Should initialize with empty wishlist
    expect(result.current.wishlistItems).toEqual([]);
  });

  it('updates localStorage when adding items', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    expect(savedWishlist).toEqual([mockProduct]);
  });

  it('updates localStorage when removing items', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
      result.current.removeFromWishlist(mockProduct.id);
    });

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    expect(savedWishlist).toEqual([]);
  });

  it('updates localStorage when clearing wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
      result.current.clearWishlist();
    });

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    expect(savedWishlist).toEqual([]);
  });

  it('maintains wishlist state between re-renders', () => {
    const { result, rerender } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    rerender();

    expect(result.current.wishlistItems).toContainEqual(mockProduct);
  });

  it('provides correct count of wishlist items', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlistCount).toBe(0);

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    expect(result.current.wishlistCount).toBe(1);

    act(() => {
      result.current.addToWishlist({ ...mockProduct, id: 2 });
    });

    expect(result.current.wishlistCount).toBe(2);
  });
}); 