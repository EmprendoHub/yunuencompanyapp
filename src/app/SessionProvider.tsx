"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, tienda } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { useState } from "react";
import { TotalUsageContext } from "./(context)/TotalUsageContext";

const CustomSessionProvider = ({ children }: { children: any }) => {
  const [totalUsage, setTotalUsage] = useState(0);
  return (
    <Provider store={tienda}>
      <AuthProvider>
        <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
          <PersistGate persistor={persistor}>
            <SessionProvider>{children}</SessionProvider>
          </PersistGate>
        </TotalUsageContext.Provider>
      </AuthProvider>
    </Provider>
  );
};

export default CustomSessionProvider;
