import { isAxiosError } from 'axios';
import { api } from '../lib';
import { userSchema, type UserLoginForm, type UserRegisterForm } from '../types';

const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (isAxiosError(error) && error.response?.data?.error) {
        return error.response.data.error as string;
    }

    return fallbackMessage;
};

export const createAccount = async (formData: UserRegisterForm) => {
    try {
        const { data } = await api.post<string>('/auth/create-account', formData);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo crear la cuenta'));
    }
};

export const authenticate = async (formData: UserLoginForm) => {
    try {
        const { data } = await api.post<string>('/auth/login', formData);

        localStorage.setItem('autenticationToken', data);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo iniciar sesión'));
    }
};

export async function getUser() {
    const token = localStorage.getItem('autenticationToken');
    if (!token) return null;

    try {
        const { data } = await api('/auth/user');
        const parsed = userSchema.safeParse(data);

        if (!parsed.success) {
            localStorage.removeItem('autenticationToken');
            return null;
        }

        return parsed.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            return null;
        }

        throw new Error(getApiErrorMessage(error, 'No se pudo validar la sesión'));
    }
}
