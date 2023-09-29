import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../utils/config";
import axios, { AxiosError } from "axios";
import { MovieType } from "../types/movie";
import { useSnackbarContext } from "./SnackBarAlertContext";


type FavoritesContextType = {
    favorites: MovieType[];
    favoritesMovieIds: Record<number, boolean>; // object type-> key: movieId, value: boolean indicating favorited status
    // setFavorites: (favorites: Record<number, boolean>) => void; //encapsulate in functions

    addFavorite: (movie: MovieType) => void;
    removeFavorite: (movieId: number) => void;
    fetchFavorites: () => void;
};

// context object
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

//custom hook 
export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("FavoritesContext must be used within FavoritesProvider");
    }
    return context;
};

// define the prop types for FavoritesProvider
interface FavoritesProviderProps {
    children: ReactNode; // accept type that can be rendered in React
}


export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
    const initialMovieIds = JSON.parse(localStorage.getItem('favorites') || '{}');
    const [favoritesMovieIds, setFavoritesMovieIds] = useState<Record<number, boolean>>(initialMovieIds);
    const [favorites, setFavorites] = useState<MovieType[]>([]);
    const showSnackbar = useSnackbarContext();

    const addFavorite = async (movie: MovieType) => {
        try {
            const response = await axios.post(`${backendUrl}/api/favorite/add/${movie.id}`, null, {//not using req.body
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            // console.log(response); //check if movie is added
            setFavorites(prevFavorites => [...prevFavorites, movie]);
            setFavoritesMovieIds(prevState => ({ ...prevState, [movie.id]: true }));
            // Show success snackbar
            showSnackbar("Movie added to favorites successfully!", "success");
        } catch (error) {
            // const err = error as AxiosError;
            // console.log(err.response?.data);
            console.error("Failed to add movie to favorites: " + movie.id, error);
            // Show error snackbar
            showSnackbar("Failed to add movie to favorites. Please try again!", "error");
        }
    };

    const removeFavorite = async (movieId: number) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/favorite/remove/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            // console.log(response);

            setFavorites(prevState => prevState.filter(movie => movie.id !== movieId));
            setFavoritesMovieIds(prevFavorites => {
                const updatedFavorites = { ...prevFavorites };
                delete updatedFavorites[movieId]; //delete key movieid property from favorites object
                return updatedFavorites; //callback
            });
            // Showing success snackbar
            showSnackbar("Movie removed from favorites successfully!", "success");
        } catch (error) {
            console.error("Failed to remove favorite from movie: ", movieId, error);
            // Showing error snackbar
            showSnackbar("Failed to remove movie from favorites. Please try again.", "error");
        }
    };

    const fetchFavorites = async () => {
        try {
            // Fetch Favorites for the current user
            const { data } = await axios.get(`${backendUrl}/api/favorite`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            // console.log(data);
            //save movie ids as true
            const favoriteMoviesIds: Record<number, boolean> = {};

            data.forEach((movieObj: MovieType) => {
                favoriteMoviesIds[movieObj.id] = true;
            });

            setFavoritesMovieIds(favoriteMoviesIds);
            setFavorites(data);

        } catch (err) {
            console.error("Failed to retrieve favorite movies: ", err);
        }
    };

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favoritesMovieIds));
    }, [favoritesMovieIds]);

    return (
        <FavoritesContext.Provider value={{ favorites, favoritesMovieIds, addFavorite, removeFavorite, fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};
