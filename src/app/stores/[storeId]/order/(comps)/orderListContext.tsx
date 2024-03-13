import React, { useContext, useState } from "react";
import { RouterOutputs } from "~/trpc/shared";

type Category = RouterOutputs["category"]["get"][number];

type Item = Category["items"][number];

type OrderItem = Item & { qty: number };
type OrderList = Array<OrderItem[]>;

let a: OrderList;

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
  incCursor: () => void;
  decCursor: () => void;
  addGroup: () => void;
}

const OrderContext = React.createContext<OrderContextProps | null>(null);

const keepOrTrailIdx = (curIdx: number, curLen: number) => {
  if (curLen === 0) {
    return;
  }
  if (curIdx + 1 < curLen) {
    return curIdx;
  }
  return curIdx - 1;
};

// do walk here?
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

      const targetGroup = list[cursor.onGroup];

      if (targetGroup) {
        return {
          ...state,
          list: list.map((itemList, i) => {
            if (i !== cursor.onGroup) {
              return itemList;
            } else {
              return [...itemList, orderItem];
            }
          }),
          cursor: {
            ...cursor,
            onItem: targetGroup.length,
            onOption: undefined,
          },
        };
      } else {
        return {
          ...state,
          list: [...list, [orderItem]],
          cursor: { ...cursor, onItem: 0, onOption: undefined },
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
  const incCursor = () => {
    setState((state) => {
      const { cursor, list } = state;
      if (cursor.onItem === undefined) {
        return state;
      }
      const targetGroup = list[cursor.onGroup];
      if (!targetGroup) {
        return state;
      }
      const item = targetGroup[cursor.onItem];
      if (!item) {
        return state;
      }

      return {
        ...state,
        list: list.map((group, gk) => {
          if (gk !== cursor.onGroup) {
            return group;
          }
          return group.map((item, ik) => {
            if (ik !== cursor.onItem) {
              return item;
            }
            return { ...item, qty: item.qty + 1 };
          });
        }),
      };
    });
  };
  const decCursor = () => {
    setState((state) => {
      const { cursor, list } = state;
      if (cursor.onItem === undefined) {
        return state;
      }
      const curItemIdx = cursor.onItem;
      const curGroupIdx = cursor.onGroup;

      const targetGroup = list[curGroupIdx];
      if (!targetGroup) {
        return state;
      }
      const item = targetGroup[curItemIdx];
      if (!item) {
        return state;
      }

      if (item.qty < 2) {
        return {
          ...state,
          list: list.map((group, gk) => {
            if (gk !== cursor.onGroup) {
              return group;
            }
            return group.filter((_, ik) => curItemIdx !== ik);
          }),
          cursor: {
            ...cursor,
            onItem: keepOrTrailIdx(curItemIdx, targetGroup.length),
          },
        };
      }

      return {
        ...state,
        list: list.map((group, gk) => {
          if (gk !== curGroupIdx) {
            return group;
          }
          return group.map((item, ik) => {
            if (ik !== cursor.onItem) {
              return item;
            }
            return { ...item, qty: item.qty - 1 };
          });
        }),
      };
    });
  };
  const addGroup = () => {
    setState((state) => {
      const { cursor, list } = state;
      const { onGroup } = cursor;

      const curGroup = list[onGroup];

      // will not occur if cursor is managed properly
      if (!curGroup) {
        return state;
      }

      // no need to add new group, use curGroup
      if (curGroup.length === 0) {
        return state;
      }

      //   list: new Map(list).set(cursor.onGroup, [...targetGroup, orderItem]),
      return {
        ...state,
        cursor: { onGroup: 0, onItem: undefined, onOption: undefined },
        // list: new Map(list).set(),
      };
    });
  };

  const addMemo = () => {};

  //   const delCursor =

  const initState: OrderContextProps = {
    list: new Array<OrderItem[]>(),
    cursor: {
      onGroup: 0,
      onItem: undefined,
      onOption: undefined,
    },
    addItem: addItem,
    setCursor: setCursor,
    incCursor: incCursor,
    decCursor: decCursor,
    addGroup: addGroup,
  };

  const [state, setState] = useState<OrderContextProps>(initState);

  return (
    <OrderContext.Provider value={state}>{children}</OrderContext.Provider>
  );
};

const useOrder = () => {
  const c = useContext(OrderContext);
  if (!c) {
    throw new Error("orderContext not initialized");
  }
  return c;
};

export { OrderContextProvider, useOrder };
