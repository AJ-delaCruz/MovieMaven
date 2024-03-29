import { Link, useLocation } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import './settings.scss';

const Sidebar: React.FC = () => {
    const location = useLocation(); // determine the active link

    return (
        <div className='sidebar' >
            <div className='header'>
                <Typography variant="h6">Settings</Typography>
            </div>
            {/* <Divider sx={{ color: 'red', backgroundColor: '#282828' }} /> */}
            <List>
                <ListItemButton component={Link} to="/settings/profile" selected={location.pathname === "/settings/profile"}>
                    <ListItemText primary="Edit Profile" />
                </ListItemButton>
                <ListItemButton component={Link} to="/settings/preferences" selected={location.pathname === "/settings/preferences"}>
                    <ListItemText primary="Preferences" />
                </ListItemButton>
                <ListItemButton component={Link} to="/settings/notification" selected={location.pathname === "/settings/notification"}>
                    <ListItemText primary="Notifications" />
                </ListItemButton>
                <ListItemButton component={Link} to="/settings/delete" selected={location.pathname === "/settings/delete"}>
                    <ListItemText primary="Delete Account" />
                </ListItemButton>
            </List>
        </div >
    );
};

export default Sidebar;
