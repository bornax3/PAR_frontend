import { ReactNode, createContext, useState } from "react";

interface AuthProviderProps {
  children: ReactNode; // Specify the type of children
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
  userToken: string | null;
  roles: string[] | null;
  userId: number | null;
  login: (token: string, roles: string[], userId: number) => void;
  logout: () => void;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(
    localStorage.getItem("userToken") || null
  );
  const storedRoles = JSON.parse(localStorage.getItem("roles") || "null");
  const [roles, setRoles] = useState<string[] | null>(
    storedRoles !== "null" ? storedRoles : null
  );

  const storedUserId = JSON.parse(localStorage.getItem("userId") || "null");
  const [userId, setUserId] = useState<number | null>(
    storedUserId !== null ? storedUserId : null
  );

  const login = (token: string, userRoles: string[], id: number) => {
    setUserToken(token);
    setRoles(userRoles);
    setUserId(id);

    localStorage.setItem("userToken", token);
    localStorage.setItem("roles", JSON.stringify(userRoles));
    localStorage.setItem("userId", JSON.stringify(id));
  };

  const logout = () => {
    setUserToken(null);
    setRoles(null);
    setUserId(null);

    localStorage.removeItem("userToken");
    localStorage.removeItem("roles");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, roles, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
