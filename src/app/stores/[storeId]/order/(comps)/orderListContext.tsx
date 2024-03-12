import React, { useContext, useState } from "react";
import { RouterOutputs } from "~/trpc/shared";

type Category = RouterOutputs["category"]["get"][number];

type Item = Category["items"][number];

type OrderItem = Item & { qty: number };
type OrderList = Map<number, OrderItem[]>;

type Cursor = {
  onGroup: number;
  onItem: number | undefined;
  onOption: number | undefined;
};

type OptionalCursor =
  | Omit<Cursor, "onItem" | "onOption">
  | Omit<Cursor, "onItem">
  | Cursor;

interface OrderContextProps {
  list: OrderList;
  cursor: Cursor;
  addItem: (item: Item) => void;
  setCursor: (cursor: OptionalCursor) => void;
}

// ??? do i want to init null and do checks elsewhere? or just hack myway here?
const OrderContext = React.createContext<OrderContextProps>({
  list: new Map<number, OrderItem[]>(),
  cursor: {
    onGroup: 0,
    onItem: -1,
    onOption: -1,
  },
  addItem: (item: Item) => {
    return 0;
  },
  setCursor: (cursor: OptionalCursor) => {
    return 0;
  },
});

// const OrderContext = React.createContext<OrderContextProps | null>(null);

// const cursorOps = (cursor: Cursor) => {
//   const setItemIdx = (itemIdx: number): Cursor => {
//     return { ...cursor, onItem: itemIdx };
//   };
//   return { setItemIdx };
// };

const OrderContextProvider = ({ children }: { children: React.ReactNode }) => {
  const addItem = (item: Item) => {
    setState(({ cursor, list }) => {
      const orderItem: OrderItem = { ...item, qty: 1 };

      const targetGroup = list.get(cursor.onGroup);

      if (targetGroup) {
        return {
          ...state,
          list: new Map(list).set(cursor.onGroup, [...targetGroup, orderItem]),
          cursor: { ...cursor, onItem: targetGroup.length },
        };
      } else {
        return {
          ...state,
          list: new Map(list).set(cursor.onGroup, [orderItem]),
          cursor: { ...cursor, onItem: 0 },
        };
      }
    });
  };

  const setCursor = ({
    onGroup,
    onItem,
    onOption,
  }: {
    onGroup: number;
    onItem?: number;
    onOption?: number;
  }) => {
    setState((prev) => {
      return {
        ...prev,
        cursor: {
          onGroup: onGroup,
          onItem: onItem,
          onOption: onOption,
        },
      };
    });
  };

  const initState = {
    list: new Map<number, OrderItem[]>(),
    cursor: {
      onGroup: 0,
      onItem: -1,
      onOption: -1,
    },
    addItem: addItem,
    setCursor: setCursor,
  };

  const [state, setState] = useState<OrderContextProps>(initState);

  return (
    <OrderContext.Provider value={state}>{children}</OrderContext.Provider>
  );
};

const useOrder = () => useContext(OrderContext);

export { OrderContextProvider, useOrder };
