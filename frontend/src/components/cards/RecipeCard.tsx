import { AiOutlineLike } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import type { RecipeCardType } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleFavorites } from '../../services/RecipeApi';
import { useState } from 'react';

type RecipeCardProps = {
    recipe: RecipeCardType;
};

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
    const queryClient = useQueryClient();
    const [likesCount, setLikesCount] = useState(recipe.likesCount);
    const [isLiked, setIsLiked] = useState(recipe.isLiked);

    const { mutate, isPending } = useMutation({
        mutationFn: toggleFavorites,
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(data) {
            toast.success(data?.message);
            setLikesCount(data!.likesCount);
            setIsLiked((prev) => !prev);
            queryClient.invalidateQueries({ queryKey: ['recipes', 'userFavorites', 'userRecipes'] });
        }
    });

    return (
        <article className="glass-panel border border-teal-100 p-4 w-full max-w-[22rem] min-h-[430px] rounded-2xl shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all">
            <img src={recipe.image} alt="imagen-receta" className="rounded-xl h-44 w-full object-cover" />

            <div className="mb-2 space-y-2">
                <h3 className="font-black text-xl text-teal-900 capitalize leading-tight">{recipe.title}</h3>
                <p className="font-medium text-teal-800">Tiempo: {recipe.cookTime} min</p>
                <p className="font-medium text-teal-800">Porciones: {recipe.portions}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {recipe.tags.map((tag) => (
                        <span key={tag} className="text-xs font-semibold capitalize bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-2 py-1">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={() => !isPending && mutate(recipe._id)}
                    className="flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-orange-600 transition-colors cursor-pointer"
                >
                    <AiOutlineLike className={`text-xl ${isLiked ? 'text-orange-600' : 'text-teal-600'}`} />
                    Likes: {likesCount}
                </button>

                <Link
                    className="rounded-full px-4 py-2 bg-teal-700 text-white font-bold hover:bg-teal-800 transition-colors"
                    to={`/recipes/${recipe._id}`}
                >
                    Ver detalle
                </Link>
            </div>
        </article>
    );
};
