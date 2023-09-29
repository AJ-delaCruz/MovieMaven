import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { backendUrl } from '../../utils/config';
import { Snackbar, Alert } from '@mui/material';
type Severity = 'success' | 'error' | 'info' | 'warning';

const EditPassword: React.FC = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_new_password: '',
    });


    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<Severity>("success");


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // console.log(formData);
        if (formData.new_password !== formData.confirm_new_password) {
            setSnackbarMessage("New password and confirmation password do not match!");
            setAlertSeverity("warning");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.put(`${backendUrl}/api/user/profile/password`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.status === 200) {
                setSnackbarMessage("Password updated successfully!");
                setAlertSeverity("success");
            } else {
                setSnackbarMessage("Failed to update password.");
                setAlertSeverity("warning");
            }
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Failed to update password:', error);
            setSnackbarMessage("Error updating password. Please try again.");
            setAlertSeverity("error");
            setOpenSnackbar(true);
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '500px' }}>
            <h2>Change Password</h2>

            <TextField
                label="Current Password"
                type="password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"

                InputProps={{
                    style: {
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: '#c4c4c4'  // subtle gray border for better definition
                    }
                }}
                InputLabelProps={{ style: { color: '#4a4a4a' } }}
            />

            <TextField
                label="New Password"
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"

                InputProps={{
                    style: {
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: '#c4c4c4'  // subtle gray border for better definition
                    }
                }}
                InputLabelProps={{ style: { color: '#4a4a4a' } }}
            />

            <TextField
                label="Confirm New Password"
                type="password"
                name="confirm_new_password"
                value={formData.confirm_new_password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"

                InputProps={{
                    style: {
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: '#c4c4c4'  // subtle gray border for better definition
                    }
                }}
                InputLabelProps={{ style: { color: '#4a4a4a' } }}
            />

            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Change Password
                </Button>
            </div>

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
        </div>
    );
};

export default EditPassword;
