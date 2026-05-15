import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Recipe, { IRecipe } from '../models/Recipe';
import User from '../models/User';

export class RecipeController {
    static CreateRecipe = async (req: Request<{}, IRecipe, {}>, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });

        try {
            const recipe = new Recipe(req.body);
            recipe.author = req.user._id;

            await recipe.save();
            return res.status(201).send('Receta creada correctamente');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al crear receta' });
        }
    };

    static GetAllRecipes = async (_req: Request, res: Response) => {
        try {
            const recipes = await Recipe.find();
            return res.json(recipes);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al obtener recetas' });
        }
    };

    static GetUserRecipes = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });

        try {
            const recipes = await Recipe.find({ author: req.user._id });
            return res.json(recipes);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al obtener recetas del usuario' });
        }
    };

    static GetFavoritesRecipes = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });

        try {
            const recipes = await Recipe.find({
                _id: { $in: req.user.favorites }
            });
            return res.json(recipes);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al obtener favoritos' });
        }
    };

    static GetRecipeById = async (req: Request, res: Response) => {
        const { recipeId } = req.params;

        try {
            const recipe = await Recipe.findById(recipeId).populate('comments');
            if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });

            return res.json(recipe);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al obtener receta' });
        }
    };

    static UpdateRecipe = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });
        const { recipeId } = req.params;

        try {
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });

            if (recipe.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Sin permisos' });
            }

            recipe.title = req.body.title;
            recipe.cookTime = req.body.cookTime;
            recipe.portions = req.body.portions;
            recipe.steps = req.body.steps;
            recipe.ingredients = req.body.ingredients;
            recipe.tags = req.body.tags;

            await recipe.save();
            return res.send('Receta actualizada correctamente');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al actualizar receta' });
        }
    };

    static DeleteRecipe = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });
        const { recipeId } = req.params;

        try {
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });

            if (recipe.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Sin permisos' });
            }

            await recipe.deleteOne();
            await User.updateMany(
                { favorites: recipeId },
                { $pull: { favorites: recipeId } }
            );

            return res.send('Receta eliminada correctamente');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al eliminar receta' });
        }
    };

    static FavoriteRecipe = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });
        const { recipeId } = req.params;

        try {
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

            const recipe = await Recipe.findById(recipeId);
            if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });

            const alreadyFavorite = user.favorites.some((favoriteId) => favoriteId.toString() === recipeId);

            let message = '';
            if (!alreadyFavorite) {
                user.favorites.push(recipe._id as Types.ObjectId);
                recipe.likesCount += 1;
                message = 'Receta agregada a favoritos';
            } else {
                user.favorites = user.favorites.filter((favoriteId) => favoriteId.toString() !== recipeId);
                recipe.likesCount = Math.max(recipe.likesCount - 1, 0);
                message = 'Receta eliminada de favoritos';
            }

            await Promise.all([user.save(), recipe.save()]);
            return res.json({ message, likesCount: recipe.likesCount });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al actualizar favoritos' });
        }
    };
}

