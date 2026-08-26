"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { PreviewProduct } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";

export type CartItem = {
  product: PreviewProduct;
  size: number;
};

function getItemPrice({ product, size }: CartItem): number {
  return (
    product.variants.find((variant) => variant.size_ml === size)?.price ?? 0
  );
}

type CartContextValue = {
  cart: CartItem[];
  cartCount: number;
  isOpen: boolean;
  addToCart: (product: PreviewProduct, size: number) => void;
  removeFromCart: (index: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product: PreviewProduct, size: number) => {
    setCart((current) => [...current, { product, size }]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.length,
      isOpen,
      addToCart,
      removeFromCart,
      openCart,
      closeCart,
    }),
    [cart, isOpen, addToCart, removeFromCart, openCart, closeCart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {isOpen && (
        <CartDrawer
          cart={cart}
          onClose={closeCart}
          onRemove={removeFromCart}
        />
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

function CartDrawer({
  cart,
  onClose,
  onRemove,
}: {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (index: number) => void;
}) {
  const total = cart.reduce((sum, item) => sum + getItemPrice(item), 0);

  return (
    <div className="fixed inset-0 z-[70] bg-black/60" onClick={onClose}>
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col bg-[var(--bg)] p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <h2 className="font-display text-3xl">Your cart</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-2xl text-[var(--fg-muted)]"
          >
            &times;
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-[var(--fg-muted)]">
            Your cart is empty.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {cart.map((item, index) => {
              const { product, size } = item;
              const price = getItemPrice(item);

              return (
                <div
                  key={`${product.item_code}-${size}-${index}`}
                  className="flex gap-4 border-b border-[var(--border)] py-5"
                >
                  <img
                    src={
                      size === 8
                        ? product.image_8ml
                        : size === 15
                          ? product.image_15ml
                          : product.image_50ml
                    }
                    alt=""
                    className="h-20 w-16 object-contain"
                  />
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-[var(--fg-subtle)]">
                        {size}ml
                      </p>
                      <p className="mt-1 font-display text-xl">
                        {product.code_name}
                      </p>
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="mt-2 text-[0.6rem] uppercase tracking-[0.15em] text-[var(--fg-muted)]"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="shrink-0 text-sm text-[var(--fg)]">
                      {formatPrice(price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                Total
              </span>
              <span className="font-display text-2xl text-[var(--fg)]">
                {formatPrice(total)}
              </span>
            </div>
            <button
              type="button"
              className="w-full bg-[var(--fg)] px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--bg)]"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
