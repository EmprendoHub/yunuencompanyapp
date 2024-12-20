"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, tienda } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

const CustomSessionProvider = ({ children }: { children: any }) => {
  useEffect(() => {
    const initWebSocket = async () => {
      await fetch("/api/socket"); // This initializes the WebSocket server
    };

    initWebSocket();
  }, []);
  return (
    <Provider store={tienda}>
      <AuthProvider>
        <PersistGate persistor={persistor}>
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
        </PersistGate>
      </AuthProvider>
    </Provider>
  );
};

export default CustomSessionProvider;
