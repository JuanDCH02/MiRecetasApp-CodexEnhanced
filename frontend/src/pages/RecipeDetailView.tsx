import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getRecipeById } from '../services/RecipeApi';
import { CommentList } from '../components/comments/CommentList';
import { IngredientList } from '../components/recipes/IngredientList';

export const RecipeDetailView = () => {
    const { recipeId } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['recipeData', recipeId],
        queryFn: () => getRecipeById(recipeId!)
    });

    if (isLoading) {
        return <p className="text-center text-lg text-gray-500">Cargando receta...</p>;
    }

    if (isError) {
        return <p className="text-center text-lg text-red-600">{error.message}</p>;
    }

    if (!data) {
        return <p className="text-center text-lg text-gray-500">No se encontró la receta</p>;
    }

    return (
        <>
            <section className="glass-panel rounded-3xl my-8 w-full overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full p-6 sm:p-8">
                        <h1 className="text-4xl sm:text-5xl text-center font-black text-teal-900 my-4 capitalize">
                            {data.title}
                        </h1>

                        <img src={data.image} alt="imagen-referencia" className="w-full sm:w-4/5 lg:w-3/4 mx-auto rounded-2xl shadow-md object-cover" />

                        <p className="text-center font-semibold text-teal-800 mt-5">
                            Tiempo de preparación: {data.cookTime} min | Porciones: {data.portions}
                        </p>

                        <div className="my-9 space-y-4">
                            <h2 className="text-2xl text-teal-900 font-black">Paso a paso</h2>
                            <ol className="space-y-3">
                                {data.steps.map(({ step }, index) => (
                                    <li key={index} className="text-lg font-semibold text-teal-900/90 bg-white/70 rounded-xl p-3 border border-teal-100">
                                        {index + 1}. {step}
                                    </li>
                                ))}
                            </ol>

                            <Link
                                to={`/recipes/${recipeId}/add-comment`}
                                className="inline-block rounded-full px-5 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                            >
                                Agregar comentario
                            </Link>
                        </div>
                    </div>

                    <IngredientList ingredients={data.ingredients} />
                </div>
            </section>

            <CommentList comments={data.comments} />
        </>
    );
};
