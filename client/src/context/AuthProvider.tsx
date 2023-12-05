import { PropsWithChildren, createContext, useEffect, useState } from "react";

type User = {
  token: string;
  type: string;
};

type AuthContextType = {
  auth: User | null;
  signIn: (user: User) => void;
  signOut: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthContextType["auth"]>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  const signIn = (user: AuthContextType["auth"]) => {
    setAuth(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const signOut = () => {
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
