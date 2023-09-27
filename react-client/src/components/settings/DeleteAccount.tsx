import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { backendUrl } from '../../utils/config';
import axios from 'axios';
import { useAuthContext } from '../../contextAPI/AuthContext';

const DeleteAccount: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [password, setPassword] = useState<string>("");
    const { logout } = useAuthContext();

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${backendUrl}/api/user/delete`, {
                data: { current_password: password }, //PasswordRequest DTO
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                console.log("Account deleted");
                logout();
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <h2>
                Delete Account
            </h2>
            <TextField
                InputProps={{
                    style: {
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: '#c4c4c4'  // subtle gray border for better definition
                    }
                }}
                InputLabelProps={{ style: { color: '#4a4a4a' } }}
                label="Enter Password to Confirm Deletion"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth margin="normal"
                variant="outlined" />

            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}>
                    Delete
                </Button>
            </div>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-between'

                }}>

                    <Button
                        onClick={() => {
                            handleDelete();
                            setOpenDialog(false);
                        }}
                        variant="contained"
                        color="primary">
                        Confirm
                    </Button>

                    <Button onClick={() => setOpenDialog(false)} variant="contained" color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        </div >
    );
};

export default DeleteAccount;
