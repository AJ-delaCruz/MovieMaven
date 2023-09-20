import React from 'react'
import { UserType } from '../../../types/user';
import './profile.scss';

const ProfileDetails: React.FC<{ user: UserType }> = ({ user }) => {
    const avatarPlaceholder = user.username.charAt(0).toUpperCase();

    return (
        <div className="profile-details">

            <div className="avatar-container">
                <div className="avatar-placeholder">{avatarPlaceholder}</div>

                { /* todo*/}
                {/* <img src={user.profileImageUrl} alt={`${user.username}'s avatar`} /> */}
            </div>

            <h1>{user.username}</h1>

            <p>Member since {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
        </div>
    );
}

export default ProfileDetails;
