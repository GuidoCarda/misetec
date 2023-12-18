import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, User } from "@/types";

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
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setAuth(user);
    }

    setIsLoading(false);
  }, []);

  const signIn = (user: User) => {
    const decoded = jwtDecode(user!.token) as DecodedToken;

    const parsedUser = {
      ...user,
      userId: decoded.id,
    };

    localStorage.setItem("user", JSON.stringify(parsedUser));
    setAuth(parsedUser);
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setAuth(null);
  };

  // re_hfqTnJPQ_NXUQjN28ujW1r9NVvFTwsFtL

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
