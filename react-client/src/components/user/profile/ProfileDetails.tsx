import React from 'react'
import { UserType } from '../../../types/user';
import './profile.scss';
import { Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const ProfileDetails: React.FC<{ user: UserType }> = ({ user }) => {
    const avatarPlaceholder = user.username.charAt(0).toUpperCase();


    return (
        <div className="profile-details">

            {/* <div className="avatar-container"> */}


            {/* <div className="avatar-placeholder">{avatarPlaceholder}</div> */}

            { /* todo*/}
            {/* <img src={user.profileImageUrl} alt={`${user.username}'s avatar`} /> */}
            {/* <Avatar src={user.profileImageUrl} alt={`${user.username}'s avatar`} /> */}
            {/* </div> */}

            <div className="avatar-placeholder">
                {user.full_name ?
                    <Avatar {...stringAvatar(`${user.full_name}`)} />
                    :
                    <Avatar sx={{ bgcolor: deepPurple[500], width: 85, height: 85 }}>{avatarPlaceholder}</Avatar >
                }
            </div>
            {user.full_name ? <h1>{user.full_name}</h1> : <h1>{user.username}</h1>}

            {user.created_at ?
                <p>Member since {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                : ''
            }
        </div>
    );
}

// https://mui.com/material-ui/react-avatar/
function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 85,
            height: 85
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}
export default ProfileDetails;
