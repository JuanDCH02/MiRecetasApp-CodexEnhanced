import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe } from '../../services/RecipeApi';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

export default function ConfirmDelete() {
    const { recipeId } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteRecipe,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['userRecipes', 'recipes', 'userFavorites'] });
            navigate('/recipes/my-recipes');
        }
    });

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="glass-panel w-full max-w-xl p-6 rounded-2xl shadow-lg">
                <h3 className="text-center text-2xl font-black text-teal-900 my-3">¿Deseas eliminar esta receta?</h3>
                <p className="text-center text-teal-700 mb-6">Esta acción no se puede deshacer.</p>

                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => mutate(recipeId!)}
                        disabled={isPending}
                        className="bg-red-500 text-white font-bold px-5 py-2 rounded-full hover:bg-red-600 disabled:opacity-70 cursor-pointer"
                    >
                        {isPending ? 'Eliminando...' : 'Eliminar'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/recipes/my-recipes')}
                        className="bg-gray-500 text-white font-bold px-5 py-2 rounded-full hover:bg-gray-600 cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
