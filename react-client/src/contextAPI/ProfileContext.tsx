import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type ProfileContextType = {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<"favorites" | "watchlist" | "ratings">>;
};

// context object
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

//custom hook 
export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
};


// define the prop types for ProfileProvider
interface ProfileProviderProps {
    children: ReactNode; // accept type that can be rendered in React
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist' | 'ratings'>('favorites');

    return (
        <ProfileContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </ProfileContext.Provider>
    );
};
