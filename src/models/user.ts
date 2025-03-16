import {type User} from '@prisma/client';

export interface UserModel extends User {
    id: number;
    email: string;
    password: string;
}