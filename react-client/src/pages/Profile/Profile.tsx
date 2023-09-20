import { useEffect, useState } from "react";
import { useAuthContext } from "../../contextAPI/AuthContext";
import axios from "axios";
import { backendUrl } from "../../utils/config";
import { CircularProgress } from "@mui/material";
import { UserType } from "../../types/user";
import { MovieType } from "../../types/movie";
import Tab from "../../components/user/tab/Tab";
import ProfileDetails from "../../components/user/profile/ProfileDetails";

const Profile = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const { currentUser } = useAuthContext(); //access auth context shared state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<MovieType[]>([]);
    const [watchlist, setWatchlist] = useState<MovieType[]>([]);


    const getUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    const getFavorites = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/favorite`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setFavorites(response.data);
            // setFavorites(response.data.map((movie: MovieType) => ({ ...movie, id: movie.tmdb_id })));

        } catch (error) {
            console.error("Failed to retrieve favorite movies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getWatchlist = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/user/watchlist`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setWatchlist(response.data);

        } catch (error) {
            console.error("Failed to retrieve watchlist:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {

        getUser();
        getFavorites();
        getWatchlist();
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
        <div className="user-profile">
            <ProfileDetails user={user} />
            <Tab favorites={favorites} watchlist={watchlist} />


        </div>
    )
}

export default Profile;