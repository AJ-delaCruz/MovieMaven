import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../utils/config";
import axios, { AxiosError } from "axios";
import { MovieType } from "../types/movie";


type FavoritesContextType = {
    favorites: Record<number, boolean>; // object type-> key: movieId, value: boolean indicating favorited status
    // setFavorites: (favorites: Record<number, boolean>) => void; //encapsulate in functions
    addFavorite: (movieId: number) => void;
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
    const initialFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const [favorites, setFavorites] = useState<Record<number, boolean>>(initialFavorites);

    const addFavorite = async (movieId: number) => {
        try {
            const response = await axios.post(`${backendUrl}/api/favorite/add/${movieId}`, null, { //not using req.body
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
            console.log(response); //check if movie is added
            setFavorites(prevFavorites => ({ ...prevFavorites, [movieId]: true }));

        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data);
            console.error("Failed to add movie to favorites: " + movieId, error);
        }
    };

    const removeFavorite = async (movieId: number) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/favorite/remove/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            console.log(response);
            setFavorites(prevFavorites => {
                const updatedFavorites = { ...prevFavorites };
                delete updatedFavorites[movieId]; //delete key movieid property from favorites object
                return updatedFavorites; //callback
            });

        } catch (error) {
            console.error("Failed to remove favorite from movie: ", movieId, error);
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
            console.log(data);
            //save movie ids as true
            const favoriteMovies: Record<number, boolean> = {};
            
            data.forEach((movieObj: MovieType) => {
                favoriteMovies[movieObj.id] = true;
            });

            setFavorites(favoriteMovies);


        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

