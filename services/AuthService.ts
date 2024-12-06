import axios from 'axios';

const BASE_URL = 'https://sdb-backend.onrender.com/api/v1/auth';

export interface UserRegistrationRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    status: string;
    message: string;
    token?: string;
    role?: string;
}

export const AuthService = {
    register: async (userData: UserRegistrationRequest): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${BASE_URL}/register`, userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data;
            }
            throw new Error('Registration failed');
        }
    },

    login: async (credentials: UserLoginRequest): Promise<AuthResponse> => {
        try {
            console.log(credentials);
            const response = await axios.post<AuthResponse>(`${BASE_URL}/login`, credentials);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data;
            }
            console.log(error);
            throw new Error('Login failed');
        }
    },

    resetPassword: async (resetData: UserLoginRequest): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${BASE_URL}/reset-password`, resetData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data;
            }
            throw new Error('Password reset failed');
        }
    }
};