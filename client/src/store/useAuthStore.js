import { create } from 'zustand';
import axiosInstance from '../utils/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoading: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/me');
            set({ authUser: res.data });
        } catch {
            set({ authUser: null });
            localStorage.removeItem('nexchat_token');
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    register: async (formData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post('/auth/register', formData);
            if (res.data.token) {
                localStorage.setItem('nexchat_token', res.data.token);
            }
            set({ authUser: res.data });
            toast.success('Account created successfully!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (formData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post('/auth/login', formData);
            if (res.data.token) {
                localStorage.setItem('nexchat_token', res.data.token);
            }
            set({ authUser: res.data });
            toast.success(`Welcome back, ${res.data.fullName}!`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch { }
        localStorage.removeItem('nexchat_token');
        set({ authUser: null });
        toast.success('Logged out successfully');
    },

    updateProfile: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put('/auth/profile', data);
            set({ authUser: res.data });
            toast.success('Profile updated!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));