import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
  useMemo,
} from "react";
import {
  useAuth0,
  User,
  RedirectLoginOptions,
  AppState,
  LogoutOptions,
} from "@auth0/auth0-react";

// Interface for the user context value
interface UserContextProps {
  myUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect: (
    options?: RedirectLoginOptions<AppState> | undefined
  ) => Promise<void>;
  logout: (options?: LogoutOptions | undefined) => void;
}

// Create context with undefined default for proper error checking
const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Destructure Auth0 hook values
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  // State for myUser, derived from Auth0 user
  const [myUser, setMyUser] = useState<User | null>(null);

  // Effect to sync myUser with Auth0 user
  useEffect(() => {
    setMyUser(isAuthenticated && user ? user : null);
  }, [isAuthenticated, user]);

  // Context value, memoized to prevent unnecessary re-renders
  const contextValue = useMemo<UserContextProps>(
    () => ({
      myUser,
      isAuthenticated,
      isLoading,
      loginWithRedirect,
      logout,
    }),
    [myUser, isAuthenticated, isLoading, loginWithRedirect, logout]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default { UserContext, UserProvider };
