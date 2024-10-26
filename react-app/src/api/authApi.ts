import api from './axiosConfig';
import { AuthResponse } from '../types/authTypes';

export const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const signup = async (userData: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
};

