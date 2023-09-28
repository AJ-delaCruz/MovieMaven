import { Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';

const Notification: React.FC = () => {
    const [receiveNotifications, setReceiveNotifications] = useState<boolean>(true);
    const [receiveEmails, setReceiveEmails] = useState<boolean>(true);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#001524', maxWidth: '800px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}>
            <h2>
                Notification Settings
            </h2>
            <span>
                (In Progress)
            </span>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={receiveNotifications}
                        onChange={() => setReceiveNotifications(!receiveNotifications)}
                        style={{ color: '#e0e0e0' }}
                    />
                }
                label="App Notifications"
                style={{ color: '#e0e0e0', marginBottom: '10px', marginTop: '20px' }}

            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={receiveEmails}
                        onChange={() => setReceiveEmails(!receiveEmails)}
                        style={{ color: '#e0e0e0' }}
                    />
                }
                label="Email News & Updates"
                style={{ color: '#e0e0e0', marginBottom: '10px' }}

            />
        </div>
    );
};

export default Notification;
