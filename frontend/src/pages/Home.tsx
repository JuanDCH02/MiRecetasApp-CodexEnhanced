import { useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { RecipeCard } from '../components/cards/RecipeCard';
import { Title } from '../components/Title';
import { getRecipes } from '../services/RecipeApi';
import { useQuery } from '@tanstack/react-query';

export const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('todas');

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['recipes'],
        queryFn: getRecipes
    });

    const filteredRecipes = data?.filter((recipe) => {
        if (selectedCategory === 'todas') {
            return true;
        }

        return recipe.tags.includes(selectedCategory);
    });

    return (
        <>
            <section className="glass-panel rounded-3xl p-6 sm:p-10 mb-7">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold">Tu cocina digital</p>
                <Title>Encuentra ideas para cocinar hoy</Title>
                <p className="text-center text-teal-800/85 max-w-2xl mx-auto">
                    Explora recetas, guarda tus favoritas y arma tu propio recetario paso a paso.
                </p>
            </section>

            <CategoryFilter onCategoryChange={handleCategoryChange} />

            {isLoading ? <p className="text-center text-lg text-gray-500">Cargando recetas...</p> : null}
            {isError ? <p className="text-center text-lg text-red-600">{error.message}</p> : null}

            {!isLoading && !isError ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 justify-items-center gap-5 pb-8">
                    {!filteredRecipes || filteredRecipes.length === 0 ? (
                        <p className="text-center col-span-3 text-gray-500 text-xl">No hay recetas disponibles</p>
                    ) : (
                        filteredRecipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                    )}
                </div>
            ) : null}
        </>
    );
};
