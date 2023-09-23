import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../utils/config";
import axios from "axios";


type RatingsContextType = {
    ratings: Record<number, number>; // key: movieId, value: ratingValue
    // setRatings: (ratings: Record<number, number>) => void; //encapsulate in functions
    addOrUpdateRating: (movieId: number, ratingValue: number) => void;
    removeRating: (movieId: number) => void;
    fetchRatings: () => {}

};


// context object
const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

//custom hook 
export const useRatingsContext = () => {
    const context = useContext(RatingsContext);
    if (!context) {
        throw new Error("RatingsContext must be used within RatingsProvider");
    }
    return context;
};

// define the prop types for RatingsProvider
interface RatingsProviderProps {
    children: ReactNode; // accept type that can be rendered in React
}



export const RatingsProvider: React.FC<RatingsProviderProps> = ({ children }) => {
    // const [ratings, setRatings] = useState<Record<number, number>>({});
    const initialRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    const [ratings, setRatings] = useState<Record<number, number>>(initialRatings);


    const addOrUpdateRating = async (movieId: number, ratingValue: number) => {
        try {
            const response = await axios.post(`${backendUrl}/api/rating/${movieId}`, ratingValue, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            setRatings(currRatings => ({
                ...currRatings,
                [movieId]: ratingValue
            }));
        } catch (error) {
            console.error("Failed to add or update rating: ", error);
        }
    };

    const removeRating = async (movieId: number) => {
        console.log(movieId);
        try {
            const response = await axios.delete(`${backendUrl}/api/rating/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            console.log(response);
            setRatings(prevRatings => {
                const updatedRatings = { ...prevRatings };
                delete updatedRatings[movieId]; //delete key movieid property from rating object
                return updatedRatings;
            });

        } catch (error) {
            console.error("Failed to remove rating: ", error);
        }

    }


    const fetchRatings = async () => {

        try {
            // Fetch ratings for the current user
            const { data } = await axios.get(`${backendUrl}/api/rating/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            // console.log("ratings");
            // console.log(data);

            // Process and save ratings data
            const userRatings: Record<number, number> = {};

            data.forEach((rating: any) => {
                userRatings[rating.movie.tmdb_id] = rating.rating_value;
            });
            // Save to context and local storage
            setRatings(userRatings);
            // localStorage.setItem('ratings', JSON.stringify(userRatings));

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        localStorage.setItem('ratings', JSON.stringify(ratings));
    }, [ratings]);


    return (
        <RatingsContext.Provider value={{ ratings, fetchRatings, addOrUpdateRating, removeRating }}>
            {children}
        </RatingsContext.Provider>
    );
};
