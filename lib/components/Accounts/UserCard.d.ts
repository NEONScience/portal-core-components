import React from 'react';
export interface UserCardProps {
    pictureUrl: string;
    email: string;
    fullName: string;
    providers: string;
    lastLogin?: string;
}
declare const UserCard: (props: UserCardProps) => React.JSX.Element;
export default UserCard;
