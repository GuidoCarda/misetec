import { PropsWithChildren, createContext, useEffect, useState } from "react";

type User = {
  token: string;
  role: string;
};

type AuthContextType = {
  auth: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthContextType["auth"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      console.log("hay user", user);
      setAuth(user);
      setIsLoading(false);
    }
  }, []);

  const signIn = (user: AuthContextType["auth"]) => {
    setAuth(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
