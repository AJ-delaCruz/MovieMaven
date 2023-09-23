import { createContext, useState, useContext, ReactNode } from "react";
import { useRatingsContext } from "./RatingsContext";

//define auth context type to share
interface AuthContextType {
    currentUser: string | null;
    login: (token: string) => Promise<void>; //async
    logout: () => void;
}

// context object for authentication. Initialize context with undefined (or null)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
// export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

//make custom hook for auth context
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }

    return context;
}

// define the prop types for AuthProvider
interface AuthProviderProps {
    children: ReactNode; // accept type that can be rendered in React
}


// create the component to share states to its children components
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('token'));
    const { fetchRatings } = useRatingsContext();
    
    const login = async (token: string) => {
        localStorage.setItem("token", token);
        setCurrentUser(token);

        // Fetch ratings for the user immediately after logging in
        fetchRatings();
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("ratings"); // remove movie ratings

        setCurrentUser(null);
    };

    // Provide the shared state to the children components
    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
