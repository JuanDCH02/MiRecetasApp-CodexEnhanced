import { isAxiosError } from 'axios';
import { api } from '../lib';
import { type Recipe } from '../types';

const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (isAxiosError(error) && error.response?.data?.error) {
        return error.response.data.error as string;
    }

    return fallbackMessage;
};

export const createComment = async (id: Recipe['_id'], content: string) => {
    try {
        const { data } = await api.post<string>(`/recipes/${id}/comment`, { content });
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Error al crear el comentario'));
    }
};
