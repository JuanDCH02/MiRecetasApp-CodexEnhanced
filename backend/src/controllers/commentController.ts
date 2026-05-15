import type { Request, Response } from 'express';
import Comment from '../models/Comment';
import Recipe from '../models/Recipe';

export class CommentController {
    static CreateComment = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });
        const { recipeId } = req.params;

        try {
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });

            const comment = new Comment({
                content: req.body.content,
                author_id: req.user._id,
                author_name: req.user.name,
                recipe: recipeId
            });

            recipe.comments.push(comment._id);
            await Promise.all([recipe.save(), comment.save()]);

            return res.status(201).send('Comentario creado correctamente');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al crear el comentario' });
        }
    };

    static DeleteComment = async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' });
        const { commentId, recipeId } = req.params;

        try {
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });

            const comment = await Comment.findById(commentId);
            if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

            if (comment.author_id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Sin permisos para eliminar este comentario' });
            }

            recipe.comments = recipe.comments.filter((com) => com.toString() !== commentId);

            await Promise.all([recipe.save(), comment.deleteOne()]);
            return res.send('Comentario eliminado correctamente');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al eliminar el comentario' });
        }
    };
}
