import { isAxiosError } from 'axios';
import { api } from '../lib';
import { DashboardRecipeSchema, RecipeSchema, type CreateRecipeFormValues, type Recipe } from '../types';

const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (isAxiosError(error) && error.response?.data?.error) {
        return error.response.data.error as string;
    }

    return fallbackMessage;
};

export const getRecipes = async () => {
    try {
        const { data } = await api('/recipes/');
        const parsed = DashboardRecipeSchema.safeParse(data);
        return parsed.success ? parsed.data : [];
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudieron obtener las recetas'));
    }
};

export const getRecipeById = async (id: Recipe['_id']) => {
    try {
        const { data } = await api(`/recipes/${id}`);
        const parsed = RecipeSchema.safeParse(data);

        if (!parsed.success) {
            throw new Error('Formato de receta inválido');
        }

        return parsed.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo obtener la receta'));
    }
};

export const getUserRecipes = async () => {
    try {
        const { data } = await api('/recipes/my-recipes');
        const parsed = DashboardRecipeSchema.safeParse(data);
        return parsed.success ? parsed.data : [];
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudieron obtener tus recetas'));
    }
};

export const getUserFavorites = async () => {
    try {
        const { data } = await api('/recipes/favorites');
        const parsed = DashboardRecipeSchema.safeParse(data);
        return parsed.success ? parsed.data : [];
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudieron obtener tus favoritos'));
    }
};

export const toggleFavorites = async (id: Recipe['_id']) => {
    try {
        const { data } = await api.post<{ message: string; likesCount: number }>(`/recipes/${id}/favorite`, {});
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo actualizar favorito'));
    }
};

export const createRecipe = async (formData: CreateRecipeFormValues) => {
    try {
        const { data } = await api.post<string>('/recipes', formData);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo crear la receta'));
    }
};

export const updateRecipe = async ({ formData, id }: { formData: CreateRecipeFormValues; id: Recipe['_id'] }) => {
    try {
        const { data } = await api.put<string>(`/recipes/${id}`, formData);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo actualizar la receta'));
    }
};

export const deleteRecipe = async (id: Recipe['_id']) => {
    try {
        const { data } = await api.delete<string>(`/recipes/${id}`);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'No se pudo eliminar la receta'));
    }
};
