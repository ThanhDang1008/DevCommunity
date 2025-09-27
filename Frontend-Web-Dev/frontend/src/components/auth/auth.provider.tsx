"use client";

import { useEffect, useState, useContext } from "react";
import { createContext } from "react";

export interface DefaultAuthProvider {
  listRole: "ROOT" | "ADMIN" | "USER" | "GUEST" | "DEV";
  session: {
    statusCode: number;
    role: DefaultAuthProvider["listRole"] | null;
    userId?: string | null;
    sessionId?: string | null;
  };
}

type CreateContext = {
  userSession: DefaultAuthProvider["session"] | null;
  setUserSession: React.Dispatch<
    React.SetStateAction<DefaultAuthProvider["session"] | null>
  >;
  pathLogin: string;
  pathLoginSuccess: string;
};

export const AuthContext = createContext<CreateContext>({
  userSession: null,
  setUserSession: () => {},
  pathLogin: "/login",
  pathLoginSuccess: "/home",
});

type AuthProviderProps = {
  session: DefaultAuthProvider["session"] | null;
  children: React.ReactNode;
  pathLogin?: string;
  pathLoginSuccess?: string;
  onCheckSessionSuccess?: () => void;
  onCheckSessionUnauthorized?: () => void;
  onCheckSessionError?: () => void;
};

function AuthProvider(props: AuthProviderProps) {
  const [userSession, setUserSession] = useState<
    DefaultAuthProvider["session"] | null
  >(null);

  useEffect(() => {
    if (props.session) {
      if (props?.session?.statusCode === 200 && props?.session?.role === null) {
        return;
      }
      if (props?.session?.statusCode === 200) {
        setUserSession(props.session);
        props.onCheckSessionSuccess?.();
      } else if (props?.session?.statusCode === 401) {
        setUserSession(props.session);
        props.onCheckSessionUnauthorized?.();
      } else if (
        props?.session?.statusCode &&
        props?.session?.statusCode >= 500 &&
        props?.session?.statusCode < 600
      ) {
        setUserSession({
          statusCode: 500,
          role: null,
          userId: null,
          sessionId: null,
        });
        props.onCheckSessionError?.();
      }
    } else {
      setUserSession(null);
    }
  }, [props.session]);

  return (
    <AuthContext.Provider
      value={{
        userSession: userSession,
        setUserSession: setUserSession,
        pathLogin: props.pathLogin ? props.pathLogin : "/login",
        pathLoginSuccess: props.pathLoginSuccess
          ? props.pathLoginSuccess
          : "/home",
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
