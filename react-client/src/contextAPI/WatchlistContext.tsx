import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../utils/config";
import axios, { AxiosError } from "axios";
import { MovieType } from "../types/movie";

type WatchlistContextType = {
    watchlist: Record<number, boolean>;
    // setWatchlist: (watchlist: Record<number, boolean>) => void; //encapsulate in functions to handle state management
    addToWatchlist: (movieId: number) => void;
    removeFromWatchlist: (movieId: number) => void;
    fetchWatchlist: () => void;
};

// context object
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

//custom hook 
export const useWatchlistContext = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error("WatchlistContext must be used within WatchlistProvider");
    }
    return context;
};


// define the prop types for WatchlistProvider
interface WatchlistProviderProps {
    children: ReactNode; // accept type that can be rendered in React
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
    const initialRatings = JSON.parse(localStorage.getItem('watchlist') || '{}');
    const [watchlist, setWatchlist] = useState<Record<number, boolean>>(initialRatings);

    const addToWatchlist = async (movieId: number) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/watchlist/add`, null, {
                params: {
                    tmdbId: movieId
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }

            });
            console.log(response); //check if movie is added to watchlist
            setWatchlist(prevState => ({ //update watchlist state
                ...prevState,
                [movieId]: true,
            }));

        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data);
            console.error("Failed to add movie to watchlist: " + movieId, error);
        }

    };

    const removeFromWatchlist = async (movieId: number) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/user/watchlist/remove/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            console.log(response);
            setWatchlist(prevState => {
                const newState = { ...prevState };
                delete newState[movieId]; //delete key movieid property from watchlist object
                return newState; //callback
            });
        } catch (error) {
            console.error("Failed to remove favorite from movie: ", movieId, error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            // Fetch watchlist for the current user
            const { data } = await axios.get(`${backendUrl}/api/user/watchlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log(data);
            //save movie ids as true
            const watchlist: Record<number, boolean> = {};

            data.forEach((movieObj: MovieType) => {
                watchlist[movieObj.id] = true;
            });

            setWatchlist(watchlist);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);


    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, fetchWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};
