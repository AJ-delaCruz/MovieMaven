import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import React, { useState } from 'react';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
const Preferences: React.FC = () => {
    const [genres, setGenres] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    return (
        <div style={{ padding: '20px', backgroundColor: '#001524', color: 'white', maxWidth: '800px' }}>
            <h2>Preferences</h2>
            <span>
                (In Progress)
            </span>
            
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel style={{ color: '#4a4a4a' }}>Preferred Genres</InputLabel>
                <Select
                    multiple
                    value={genres}
                    onChange={(event) => setGenres(event.target.value as string[])}
                    label="Preferred Genres"
                    style={{ backgroundColor: 'white' }}

                >
                    {/* genres */}
                    <MenuItem value="Action">Action</MenuItem>
                    <MenuItem value="Romance">Romance</MenuItem>
                    <MenuItem value="Comedy">Comedy</MenuItem>
                    <MenuItem value="Sci-fi">Sci-fi</MenuItem>
                    <MenuItem value="Drama">Drama</MenuItem>
                    <MenuItem value="Mystery">Mystery</MenuItem>
                    <MenuItem value="MysCrimetery">Crime</MenuItem>
                    <MenuItem value="Horror">Horror</MenuItem>


                </Select>
            </FormControl>



            <FormControlLabel
                control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                label={// Dynamic label based on the darkMode state
                    <>
                        {darkMode ? <Brightness3Icon style={{ marginRight: '8px' }} /> : <WbSunnyIcon style={{ marginRight: '8px' }} />}
                        {darkMode ? "Dark Mode" : "Light Mode"}
                    </>
                }
                style={{ color: '#e0e0e0', marginTop: '20px' }}
            />
        </div >
    );
};

export default Preferences;
