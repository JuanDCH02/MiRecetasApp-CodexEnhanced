import { useQuery } from '@tanstack/react-query';
import { getUserRecipes } from '../../services/RecipeApi';
import RecipeCardProfile from '../../components/cards/RecipeCardProfile';

export const UserRecipes = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['userRecipes'],
        queryFn: getUserRecipes
    });

    if (isLoading) {
        return <p className="text-center text-xl text-gray-500">Cargando recetas...</p>;
    }

    if (isError) {
        return <p className="text-center text-xl text-red-600">{error.message}</p>;
    }

    return (
        <>
            <h1 className="text-5xl text-center font-black text-shadow-md/20 text-teal-600 my-5 capitalize">
                Recetas creadas por mí
            </h1>
            <div className="mx-auto">
                {!data || data.length === 0 ? (
                    <p className="text-center col-span-3 text-gray-500 text-xl">No hay recetas disponibles</p>
                ) : (
                    data.map((recipe) => <RecipeCardProfile key={recipe._id} recipe={recipe} />)
                )}
            </div>
        </>
    );
};
