import React, { useContext, useState } from "react";
import { orderItemListSchema, orderItemSchema } from "~/server/customTypes";
import { type RouterOutputs } from "~/trpc/shared";

type OrderItem = typeof orderItemSchema._type;

type Category = RouterOutputs["category"]["get"][number];

// TODO: replace with db def in the future
// type Option = { description: string; price: number; id: string };

type Item = Category["items"][number];
// type Item = Category["items"][number] & { options?: Option[] };

// export type OrderList = Array<OrderItem[]>;
type OrderList = typeof orderItemListSchema._type;

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
  isOrderListEmpty: boolean;
  cursor: Cursor;
  fn: {
    addItem: (item: Item) => void;
    setCursor: (cursor: OptionalCursor) => void;
    incCursor: () => void;
    decCursor: () => void;
    addGroup: () => void;
    // isOrderListEmpty: () => boolean;
  };
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

const OrderContextProvider = ({ children }: { children: React.ReactNode }) => {
  const addItem = (item: Item) => {
    setOrder((state) => {
      const { cursor, list } = state;
      const stations = item.stations.map((st) => {
        return { ...st, isDone: false };
      });
      const orderItem: OrderItem = {
        ...item,
        stations,
        options: [],
        qty: 1,
        isPaid: false,
      };

      const targetGroup = list[cursor.onGroup];
      //   console.log(item, orderItem, targetGroup);

      if (targetGroup) {
        return {
          ...state,
          isOrderListEmpty: false,
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
          isOrderListEmpty: false,
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
    setOrder((prev) => {
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
    setOrder((state) => {
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
    setOrder((state) => {
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
        if (targetGroup.length < 2) {
          const trailingGroupIdx =
            keepOrTrailIdx(curGroupIdx, list.length - 1) ?? 0;
          console.log(
            `curGroupIdx: ${curGroupIdx}, list.length: ${list.length}`,
          );

          console.log("in decCursor - trailingGroupIdx: ", trailingGroupIdx);

          const nextGroup = list[trailingGroupIdx];
          const tempOrderList = list.filter((_, gk) => gk !== curGroupIdx);
          return {
            ...state,
            list: tempOrderList,
            isOrderListEmpty: isOrderListEmpty(tempOrderList),
            cursor: {
              onGroup: trailingGroupIdx,
              onItem:
                nextGroup && nextGroup.length - 1
                  ? nextGroup.length - 1
                  : undefined,
              onOption: undefined,
            },
          };
        }
        const tempOrderList = list.map((group, gk) => {
          if (gk !== cursor.onGroup) {
            return group;
          }
          return group.filter((_, ik) => curItemIdx !== ik);
        });
        return {
          ...state,
          list: tempOrderList,
          isOrderListEmpty: isOrderListEmpty(tempOrderList),
          cursor: {
            ...cursor,
            onItem: keepOrTrailIdx(curItemIdx, targetGroup.length),
          },
        };
      }

      const tempOrderList = list.map((group, gk) => {
        if (gk !== curGroupIdx) {
          return group;
        }
        return group.map((item, ik) => {
          if (ik !== cursor.onItem) {
            return item;
          }
          return { ...item, qty: item.qty - 1 };
        });
      });
      //   qty > 1
      return {
        ...state,
        list: tempOrderList,
        isOrderListEmpty: isOrderListEmpty(tempOrderList),
      };
    });
  };
  const addGroup = () => {
    setOrder((state) => {
      const cleanList = state.list.filter((group) => group.length !== 0);

      return {
        ...state,
        list: [...cleanList, []],
        cursor: {
          onGroup: cleanList.length,
          onItem: undefined,
          onOption: undefined,
        },
      };
    });
  };

  const isOrderListEmpty = (orderList: OrderList) => {
    return !orderList.map((r) => r.length > 0).includes(true);
  };

  //   const addMemo = () => {};

  const initState: OrderContextProps = {
    list: new Array<OrderItem[]>(),
    isOrderListEmpty: true,
    cursor: {
      onGroup: 0,
      onItem: undefined,
      onOption: undefined,
    },
    fn: {
      addItem,
      setCursor,
      incCursor,
      decCursor,
      addGroup,
      //   isOrderListEmpty,
    },
  };

  const [order, setOrder] = useState<OrderContextProps>(initState);

  return (
    <OrderContext.Provider value={order}>{children}</OrderContext.Provider>
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
