import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import { MovieType } from '../../types/movie';
import axios from 'axios';
import { backendUrl } from '../../utils/config';

interface MovieMenuProps {
    movie: MovieType;
    onMenuToggle: (isOpen: boolean) => void; //to keep preview display

}

const MovieMenu: React.FC<MovieMenuProps> = ({ movie, onMenuToggle }) => {
    // console.log("Rendering MovieMenu for movie:", movie.title);
    const token = localStorage.getItem("token");

    //menu item for adding to watchlist or favorite
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        onMenuToggle(true);


    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        onMenuToggle(false);

    };

    //  add movie to watchlist
    const handleAddToWatchlist = async (movieId: number) => {

        try {
            await axios.post(`${backendUrl}/api/user/watchlist/add/`, {
                params: {
                    movieId: movieId
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });
        } catch (error) {
            console.error("Failed to add to watchlist: " + movieId, error);
        }
        handleCloseMenu();
    };


    // add movie to favorites
    const handleAddFavorite = async (movieId: number) => {
        try {
            await axios.post(`${backendUrl}/api/favorite/add/`, {
                params: {
                    tmdbId: movieId
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Failed to add to favorites: " + movieId, error);
        }
        handleCloseMenu();
    };

    return (
        <div className='movie-menu'>

            {/* <FavoriteIcon />
            <MoreVert />
            <AddIcon />
            <IconButton /> */}

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
            </Menu>

        </div >
    )
}

export default MovieMenu