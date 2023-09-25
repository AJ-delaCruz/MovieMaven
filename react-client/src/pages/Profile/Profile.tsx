import { useEffect, useState } from "react";
import { useAuthContext } from "../../contextAPI/AuthContext";
import axios from "axios";
import { backendUrl } from "../../utils/config";
import { CircularProgress } from "@mui/material";
import { UserType } from "../../types/user";
import Tab from "../../components/user/tab/Tab";
import ProfileDetails from "../../components/user/profile/ProfileDetails";
import { useWatchlistContext } from "../../contextAPI/WatchlistContext";
import { useRatingsContext } from "../../contextAPI/RatingsContext";
import { useFavoritesContext } from "../../contextAPI/FavoritesContext";

const Profile = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const { currentUser } = useAuthContext(); //access auth context shared state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { favorites, fetchFavorites } = useFavoritesContext();
    const { ratedMovies, fetchRatings } = useRatingsContext();
    const { watchlist, fetchWatchlist } = useWatchlistContext();

    const getUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${currentUser}`
                }
            });
            console.log(response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to retrieve user:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {

        getUser();
    
        fetchWatchlist(); // Fetch movies using the context api
        fetchFavorites();
        fetchRatings();
    }, []);



    if (isLoading || user == null) {
        return (
            <div
                className="loader-container">
                <CircularProgress />
            </div>
        );
    }


    return (
        <div id="tab-content" className="user-profile">
            <ProfileDetails user={user} />
            <Tab favorites={favorites} watchlist={watchlist} ratings={ratedMovies} />


        </div>
    )
}

export default Profile;