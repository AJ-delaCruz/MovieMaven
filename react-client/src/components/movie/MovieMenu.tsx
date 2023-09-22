import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box, Modal, Typography, Popover } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import { MovieType } from '../../types/movie';
import axios, { AxiosError } from 'axios';
import { backendUrl } from '../../utils/config';
import StarIcon from '@mui/icons-material/Star';
import Rating from '../rating/Rating';
import './movie.scss';
interface MovieMenuProps {
    movie: MovieType;
    onMenuToggle?: (isOpen: boolean) => void; //to keep preview display

}

const MovieMenu: React.FC<MovieMenuProps> = ({ movie, onMenuToggle }) => {
    // console.log("Rendering MovieMenu for movie:", movie.title);
    const token = localStorage.getItem("token");

    //menu item for adding to watchlist or favorite
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userRating, setUserRating] = useState<number>(0);
    const [ratingAnchor, setRatingAnchor] = useState<null | HTMLElement>(null); //refrence anchorlEl for rating modal

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        if (onMenuToggle) onMenuToggle(true);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        if (onMenuToggle) onMenuToggle(false);
    };

    const openRatingModal = () => {
        setRatingAnchor(anchorEl);  // copy the reference from anchorEl to ratingAnchor
        setAnchorEl(null);
        // handleCloseMenu();  // ?close the menu after opening the rating modal
    };

    // reset the anchorModal state
    const closeRatingModal = () => {
        setRatingAnchor(null);
        if (onMenuToggle) onMenuToggle(false); //close preview after
    }

    //  add movie to watchlist
    const handleAddToWatchlist = async (movieId: number) => {

        try {
            const response = await axios.post(`${backendUrl}/api/user/watchlist/add`, null, {
                params: {
                    tmdbId: movieId
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });
            console.log(response); //check if movie is added to watchlist
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data);
            console.error("Failed to add movie to watchlist: " + movieId, error);
        }
        handleCloseMenu();
    };


    // add movie to favorites
    const handleAddFavorite = async (movieId: number) => {
        try {
            const response = await axios.post(`${backendUrl}/api/favorite/add/${movieId}`, null, { //not using req.body
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response); //check if movie is added
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data);
            console.error("Failed to add movie to favorites: " + movieId, error);
        }
        handleCloseMenu();
    };


    const handleRatingChange = async (newRating: number) => {
        setUserRating(newRating);

        try {
            const response = await axios.post(`${backendUrl}/api/rating/${movie.id}`, newRating, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response); //check if rating is added
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data);
            console.error("Failed to add rating to movie: ", error);
        }
        // closeRatingModal();  // close the modal once rating is set
    };

    return (
        <div className='movie-menu'>

            <IconButton style={{ backgroundColor: '#cccc' }} onClick={(e) => handleOpenMenu(e)}>
                <MoreVert />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>

                {/* add to watchlist */}
                <MenuItem onClick={() => handleAddToWatchlist(movie.id)} >
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Watchlist" />
                </MenuItem>

                {/* add to favorite */}
                <MenuItem
                    onClick={() => handleAddFavorite(movie.id)}
                >
                    <ListItemIcon>
                        <FavoriteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Favorite" />
                </MenuItem>

                {/* Rating movies  */}
                <MenuItem
                    onClick={openRatingModal}
                >
                    <ListItemIcon>
                        <StarIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText primary="Rating" />
                </MenuItem>

            </Menu>


            <Popover
                open={Boolean(ratingAnchor)}
                anchorEl={ratingAnchor}
                onClose={closeRatingModal}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box style={{ padding: '20px', background: 'white', borderRadius: '5px' }}>
                    <Typography style={{ marginLeft: '10px' }} variant="h6">Rate movie</Typography>
                    <Rating currentRating={userRating} onRatingChange={handleRatingChange} />
                </Box>
            </Popover>
        </div >
    )
}

export default MovieMenu
