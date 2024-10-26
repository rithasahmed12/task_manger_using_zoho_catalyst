export interface User {
    id: string;
    username: string;
    token: string;
}

export interface AuthResponse {
    token:string;
    user: User;
    id:string
}

export interface UserState {
    userInfoTh: string | null;
}