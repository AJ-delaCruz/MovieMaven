import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../utils/config";
import axios, { AxiosError } from "axios";
import { MovieType } from "../types/movie";
import { useSnackbarContext } from "./SnackBarAlertContext";

type WatchlistContextType = {
    watchlist: MovieType[];
    // setWatchlist: MovieType[] => void; //encapsulate in functions to handle state management
    watchlistMovieIds: Record<number, boolean>;
    addToWatchlist: (movie: MovieType) => void;

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
    const initialMovieIds = JSON.parse(localStorage.getItem('watchlist') || '{}');
    const [watchlistMovieIds, setWatchlistMovieIds] = useState<Record<number, boolean>>(initialMovieIds);
    const [watchlist, setWatchlist] = useState<MovieType[]>([]);
    const showSnackbar = useSnackbarContext();

    // const addToWatchlist = async (movieId: number) => {
    const addToWatchlist = async (movie: MovieType) => {

        try {
            const response = await axios.post(`${backendUrl}/api/user/watchlist/add`, null, {
                params: {
                    tmdbId: movie.id
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }

            });
            // console.log(response); //check if movie is added to watchlist

            setWatchlist(prevState => [...prevState, movie]); //update watchlist state
            setWatchlistMovieIds(prevState => ({ ...prevState, [movie.id]: true }));

            showSnackbar("Movie successfully added to watchlist!", "success");

        } catch (error) {
            // const err = error as AxiosError; //todo UI error
            // console.log(err.response?.data);
            console.error("Failed to add movie to watchlist: " + movie.id, error);

            showSnackbar("Failed to add movie to watchlist. Please try again.", "error");

        }

    };

    const removeFromWatchlist = async (movieId: number) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/user/watchlist/remove/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            // console.log(response);

            setWatchlist(prevState => prevState.filter(movie => movie.id !== movieId)); //update state
            setWatchlistMovieIds(prevState => {
                const newState = { ...prevState };
                delete newState[movieId]; //delete key movieid property from watchlist object
                return newState;
            });

            showSnackbar("Movie successfully removed from watchlist!", "success");

        } catch (error) {
            console.error("Failed to remove favorite from movie: ", movieId, error);
            showSnackbar("Failed to remove movie from watchlist. Please try again.", "error");

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
            // console.log(data);

            //save movie ids as true
            const movieIds: Record<number, boolean> = {};
            data.forEach((movie: MovieType) => {
                movieIds[movie.id] = true;
            });

            setWatchlistMovieIds(movieIds);
            setWatchlist(data); //retrieve up to date data from backend

        } catch (err) {
            console.error("Failed to retrieve watchlist: ", err);
        }
    };



    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlistMovieIds));
    }, [watchlistMovieIds]);

    return (
        <WatchlistContext.Provider value={{ watchlist, watchlistMovieIds, addToWatchlist, removeFromWatchlist, fetchWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};
