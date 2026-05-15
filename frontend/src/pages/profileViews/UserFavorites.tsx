import { useQuery } from '@tanstack/react-query';
import { getUserFavorites } from '../../services/RecipeApi';
import { RecipeCard } from '../../components/cards/RecipeCard';

export const UserFavorites = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['userFavorites'],
        queryFn: getUserFavorites
    });

    if (isLoading) {
        return <p className="text-center text-xl text-gray-500">Cargando favoritos...</p>;
    }

    if (isError) {
        return <p className="text-center text-xl text-red-600">{error.message}</p>;
    }

    return (
        <>
            <h1 className="text-5xl text-center font-black text-shadow-md/20 text-teal-600 my-5 capitalize">
                Mis recetas favoritas
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 justify-items-center">
                {!data || data.length === 0 ? (
                    <p className="text-center col-span-3 text-gray-500 text-xl">No hay recetas disponibles</p>
                ) : (
                    data.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                )}
            </div>
        </>
    );
};
