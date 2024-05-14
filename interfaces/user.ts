
export interface IUser {
    _id      : string;
    name     : string;
    username : string;
    password?: string;
    role     : string;

    createdAt?: string;
    updatedAt?: string;
}