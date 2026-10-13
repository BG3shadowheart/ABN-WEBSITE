'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { Platform } from '@/data/products';

export type OrderDetails = {
  reference: string;
  productSlug: string;
  productName: string;
  platform: Platform;
  duration: string;
  priceLabel: string;
  paymentMethod: 'bkash' | 'nagad' | 'binance';
  paymentDestination: string;
  senderNumber: string;
  transactionId: string;
};

type OrderContextValue = {
  order: OrderDetails | null;
  setOrder: (order: OrderDetails) => void;
  clearOrder: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

/**
 * Order details exist only in React memory for the current navigation.
 * Nothing is written to localStorage, sessionStorage, cookies, or a database.
 * Reloading or closing the tab intentionally clears the draft.
 */
export function OrderContextProvider({ children }: { children: ReactNode }) {
  const [order, setCurrentOrder] = useState<OrderDetails | null>(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      if (pathname !== '/order-confirmation') setCurrentOrder(null);
      previousPathname.current = pathname;
    }
  }, [pathname]);
  const setOrder = useCallback((next: OrderDetails) => setCurrentOrder(next), []);
  const clearOrder = useCallback(() => setCurrentOrder(null), []);
  const value = useMemo(() => ({ order, setOrder, clearOrder }), [order, setOrder, clearOrder]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrderContext must be used inside OrderContextProvider.');
  return context;
}
