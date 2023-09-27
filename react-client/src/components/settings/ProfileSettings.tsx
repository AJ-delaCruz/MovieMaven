import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, CircularProgress, Tooltip, Alert } from '@mui/material';
import { UserType } from '../../types/user';
import axios from 'axios';
import { backendUrl } from '../../utils/config';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { useAuthContext } from '../../contextAPI/AuthContext';

type Severity = 'success' | 'error' | 'info' | 'warning';

const ProfileSettings: React.FC = () => {
    const [profile, setProfile] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<Severity>("success");
    const { updateToken } = useAuthContext();

    useEffect(() => {
        const getUserProfile = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${backendUrl}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log(response.data);
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to retrieve user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserProfile();
    }, []);

    const handleSave = async () => {
        try {
            const response = await axios.put(`${backendUrl}/api/user/profile`, profile, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log(response.data);
            const newToken = response.data;
            updateToken(newToken); // update token in context after updating

            if (response.status === 200) {
                setSnackbarMessage("Profile updated successfully!");
                setAlertSeverity("success");

            } else {
                setSnackbarMessage("Failed to update profile.");
                setAlertSeverity("warning");

            }
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error updating profile:", error);
            setSnackbarMessage("Error updating profile. Please try again.");
            setOpenSnackbar(true);
            setAlertSeverity("error");

        }
    };


    if (isLoading || !profile) {
        return (
            <div
                className="loader-container">
                <CircularProgress />
            </div>
        );
    }
    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            {/* toast alert */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <h2>
                Edit Profle
            </h2>

            <TextField
                label="Full Name"
                variant="outlined"
                InputProps={{
                    style: {
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: '#c4c4c4'  // subtle gray border for better definition
                    }
                }}
                InputLabelProps={{ style: { color: '#4a4a4a' } }}

                value={profile?.full_name || ''}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                margin="normal"
                fullWidth
            />

            <TextField
                //  sx={{ backgroundColor: 'white', color: 'white' }}
                label="Username"
                variant="outlined"
                InputProps={{
                    style: {
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: '#c4c4c4'
                    }
                }}
                InputLabelProps={{ style: { color: '#4a4a4a' } }} // label color
                value={profile.username || ''}
                onChange={e => setProfile({ ...profile, username: e.target.value })}
                margin="normal"
                fullWidth
            />


            <label style={{ display: 'block', marginBottom: '-16px', marginTop: '5px', color: 'gray' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', width: '807px' }}>
                <TextField
                    InputProps={{
                        style: {
                            color: 'black',
                            backgroundColor: 'white',
                            borderColor: '#c4c4c4'
                        }
                    }}
                    InputLabelProps={{ style: { color: '#4a4a4a' } }}
                    value='*******'
                    margin="normal"
                    variant="outlined"
                    style={{ flex: 1, marginRight: '20px' }}
                />

                <Link to="/settings/profile/password-change">
                    {/* <Button variant="contained">
                        Edit
                    </Button> */}
                    <Tooltip
                        title={
                            <div style={{
                                fontSize: '16px',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '6px',
                            }}>
                                Change Password

                            </div>
                        }>
                        <EditIcon sx={{ color: 'white' }} />
                    </Tooltip>
                </Link>
            </div>





            <div style={{ marginTop: '8px', textAlign: 'left', color: 'primary' }}>
                <Button
                    variant="contained"
                    onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div >
    );
};

export default ProfileSettings;
