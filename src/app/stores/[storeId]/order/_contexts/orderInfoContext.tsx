import React, { useContext, useState } from "react";
// import { RouterOutputs } from "~/trpc/shared";

// type Category = RouterOutputs["category"]["get"][number];

interface OrderInfoContextProps {
  tableName: string;
  //   decCursor: () => void;
  fn: {
    setTableName: (name: string) => void;
  };
}

const OrderInfoContext = React.createContext<OrderInfoContextProps | null>(
  null,
);

const OrderInfoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setTableName = (name: string) => {
    setState((prev) => {
      return { ...prev, tableName: name };
    });
  };

  //   const initialize = (name: string) => {
  //     setState((prev) => {
  //       return { ...prev, tableName: name };
  //     });
  //   };

  const initState: OrderInfoContextProps = {
    tableName: "",
    fn: {
      setTableName,
    },
  };

  const [state, setState] = useState<OrderInfoContextProps>(initState);

  return (
    <OrderInfoContext.Provider value={state}>
      {children}
    </OrderInfoContext.Provider>
  );
};

const useOrderInfo = () => {
  const c = useContext(OrderInfoContext);
  if (!c) {
    throw new Error("orderInfoContext not initialized");
  }
  return c;
};

export { OrderInfoContextProvider, useOrderInfo };
