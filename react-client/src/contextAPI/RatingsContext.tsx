import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../utils/config";
import axios, { AxiosError } from "axios";
import { MovieType } from "../types/movie";
import { RatingType } from "../types/rating";
import { useSnackbarContext } from "./SnackBarAlertContext";

type RatingsContextType = {
    ratedMovies: MovieType[];
    ratings: Record<number, number>;  // MovieID -> RatingValue
    // setRatings: (ratings: Record<number, number>) => void; //encapsulate in functions

    addOrUpdateRating: (movie: MovieType, ratingValue: number) => void;
    removeRating: (movieId: number) => void;
    fetchRatings: () => void;
};

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

export const useRatingsContext = () => {
    const context = useContext(RatingsContext);
    if (!context) {
        throw new Error("RatingsContext must be used within RatingsProvider");
    }
    return context;
};

interface RatingsProviderProps {
    children: ReactNode;
}

export const RatingsProvider: React.FC<RatingsProviderProps> = ({ children }) => {
    const [ratedMovies, setRatedMovies] = useState<MovieType[]>([]);
    const [ratings, setRatings] = useState<Record<number, number>>(JSON.parse(localStorage.getItem('ratings') || '{}'));
    const showSnackbar = useSnackbarContext();

    const addOrUpdateRating = async (movie: MovieType, ratingValue: number) => {
        try {
            const response = await axios.post(`${backendUrl}/api/rating/${movie.id}`, ratingValue, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(response);

            //update rated movies state if it doesn't exist in case of updating rating
            setRatedMovies(prevState => {
                if (!prevState.some(m => m.id === movie.id)) { //add movie if doesn't exist yet
                    return [...prevState, movie];
                }
                return prevState;
            });

            setRatings(prevRatings => ({ //update user rating
                ...prevRatings,
                [movie.id]: ratingValue
            }));

            showSnackbar("Successfully rated movie!", "success");

        } catch (error) {
            // const err = error as AxiosError;
            // console.log(err.response?.data);
            console.error("Failed to add or update rating for movie: " + movie.id, error);
            showSnackbar("Failed to rate movie. Please try again.", "error");

        }
    };

    const removeRating = async (movieId: number) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/rating/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            // console.log(response);


            setRatedMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));//update state
            setRatings(prevRatings => {
                const newRatings = { ...prevRatings };
                delete newRatings[movieId]; //delete key movieid property from rating object
                return newRatings;
            });

            showSnackbar("Rating successfully removed!", "success");

        } catch (error) {
            console.error("Failed to remove rating for movie: ", movieId, error);
            showSnackbar("Failed to remove rating. Please try again.", "error");

        }
    };

    const fetchRatings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/rating/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            //store ratings of each movie rated
            const userRatings: Record<number, number> = {};
            data.forEach((movie: RatingType) => {
                userRatings[movie.id] = movie.user_rating;
            });

            setRatings(userRatings);
            setRatedMovies(data);

        } catch (err) {
            console.error("Failed to retrieve ratings for movies: ", err);
        }
    };

    useEffect(() => {
        localStorage.setItem('ratings', JSON.stringify(ratings));
    }, [ratings]);

    return (
        <RatingsContext.Provider value={{ ratedMovies, ratings, addOrUpdateRating, removeRating, fetchRatings }}>
            {children}
        </RatingsContext.Provider>
    );
};
