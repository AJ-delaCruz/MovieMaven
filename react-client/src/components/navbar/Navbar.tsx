import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    IconButton, Badge, ListItemText, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';
// import { NotificationContext } from '../../contextAPI/NotificationContext'; //TODO
import { useAuthContext } from '../../contextAPI/AuthContext';
import SearchBar from '../search/SearchBar';
import "./navbar.scss";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { useProfileContext } from '../../contextAPI/ProfileContext';

// type NotificationEvent = {//todo
//     message: string;
// };

const Navbar: React.FC = () => {
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
    const { activeTab, setActiveTab } = useProfileContext(); //tabs
    const location = useLocation();

    const { logout } = useAuthContext();
    // const { notificationCount, notificationEvents, markAsRead, markAllAsRead } = useContext(NotificationContext); //TODO
    const navigate = useNavigate();

    const notificationOpen = Boolean(notificationAnchorEl);
    const profileOpen = Boolean(profileAnchorEl);

    const handleNotificationIconMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setNotificationAnchorEl(null);
        setProfileAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };

    const handleSettings = () => {
        handleClose();
        navigate('/settings/profile');
    };

    // const handleNotificationClick = (index: number) => {
    //     // markAsRead(index);
    // };



    const navbarRef = useRef<HTMLDivElement | null>(null);

    //scroll to the top of the user-profile when clicking favorites/watchlist/ratings icons
    const scrollToContent = () => {
        const contentElement = document.getElementById("tab-content");
        const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight : 0;

        if (contentElement) {
            window.scroll({
                top: contentElement.offsetTop - navbarHeight, //account for navbar's height (sticky)
                behavior: "smooth"
            });
        }
    };

    //navigate to profile page based on tab chosen
    const handleTabClick = (tab: 'favorites' | 'watchlist' | 'ratings') => {
        setActiveTab(tab);
        // console.log(location.pathname);
        if (location.pathname !== "/profile") {
            navigate('/profile');
        }
        scrollToContent();
    };

    return (
        <div className="navbar" ref={navbarRef}>

            <div className="left">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">MovieMaven</span>
                </Link>
            </div>


            <div className="mid">
                <SearchBar />

            </div>

            <div className="right">



                <div>
                    {/* favorite movies*/}
                    <IconButton
                        size='large'
                        onClick={() => handleTabClick('favorites')}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)' // lighten on hover
                            },
                            color: (activeTab === 'favorites' && location.pathname === "/profile") ? 'red' : '#ffffff' // dynamic coloring
                        }}
                    >
                        <FavoriteIcon fontSize="medium" />
                    </IconButton>


                    {/* watchlist */}
                    <IconButton size='large' onClick={() => handleTabClick('watchlist')}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)' // lighten on hover
                            },
                            color: (activeTab === 'watchlist' && location.pathname === "/profile") ? 'blue' : '#ffffff'
                        }}
                    >
                        <BookmarkIcon fontSize="medium" />
                    </IconButton>

                    {/* Rating movies  */}
                    <IconButton size='large' onClick={() => handleTabClick('ratings')}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)' // lighten on hover
                            },
                            color: (activeTab === 'ratings' && location.pathname === "/profile") ? 'gold' : '#ffffff'
                        }}
                    >
                        <StarIcon fontSize="inherit" />
                    </IconButton>
                </div>

                <IconButton color="inherit" onClick={handleNotificationIconMenuClick}>
                    {/* <Badge badgeContent={notificationCount} color="primary" > */}
                    <Badge badgeContent={0} color="primary" >
                        <NotificationsOutlinedIcon className="icon-cls" style={{ marginRight: "-9px" }} />

                    </Badge>
                </IconButton>


                <div className="leftRight" onClick={handleProfileClick}>
                    <PersonOutlinedIcon className="icon-cls" />
                </div>


                {/* Notifications menu */}
                <Menu anchorEl={notificationAnchorEl} open={notificationOpen} onClose={handleClose}>

                    {/* {notificationEvents.length > 0 ? (
                        [
                            notificationEvents.map((event, index) => (
                                <MenuItem key={index} onClick={() => handleNotificationClick(index)}>
                                    <ListItemIcon>
                                        <NotificationsActiveIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={event.message} />
                                </MenuItem>
                            )),
                            <MenuItem key="mark-all" onClick={markAllAsRead}>
                                <ListItemText secondary="Mark all as read" align="center" />
                            </MenuItem>
                        ]
                    ) : ( */}
                    <MenuItem disabled>

                        <ListItemText primary="No notifications" />
                    </MenuItem>
                    {/* )} */}
                </Menu>


                {/* profile menus */}
                <Menu anchorEl={profileAnchorEl} open={profileOpen} onClose={handleClose} >

                    <MenuItem onClick={handleProfile}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>

                    <MenuItem onClick={handleSettings}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Navbar;
