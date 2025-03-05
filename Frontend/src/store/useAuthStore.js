import { create } from 'zustand';
import axiosInstance from '../utils/axios';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useAuthStore = create(
    (set) => ({
        user: null,


        // Login Function
        login: async (email, password) => {
            try {
                const response = await axiosInstance.post(`/auth/login`, { email, password });

                set({ user: response.data });
                // console.log('Login Response:', response.data);

                return response.data;
            } catch (error) {
                console.error('Login Error:', error.response?.data?.message || error.message);
                throw new Error(error.response?.data?.message || 'Login failed.');
            }
        },

        // Signup Function
        signup: async (name, email, password) => {
            try {
                const response = await axiosInstance.post(`/auth/signup`, { name, email, password });

                // console.log('Signup Response:', response.data);

                if (response.status === 200) {
                    set({ user: response.data });
                    return response.data;
                } else {
                    throw new Error('Signup failed.');
                }
            } catch (error) {
                console.error('Signup Error:', error.response?.data?.message || error.message);
                throw new Error(error.response?.data?.message || 'Signup failed.');
            }
        },

        // Logout Function (Optional)
        logout: () => {
            try {
                axiosInstance.post(`/auth/logout`);
                set({ user: null })
                return true;
            } catch (error) {
                toast.error('Logout failed.');
            }
        },

    


    }),

);

export default useAuthStore;
