/// <reference types="react" />
export interface UserCardProps {
    pictureUrl: string;
    email: string;
    fullName: string;
    providers: string;
    lastLogin?: string;
}
declare const UserCard: (props: UserCardProps) => JSX.Element;
export default UserCard;
