import type { Recipe } from '../../types';

type IngredientListProps = {
    ingredients: Recipe['ingredients'];
};

export const IngredientList = ({ ingredients }: IngredientListProps) => {
    return (
        <aside className="lg:w-80 bg-white/70 border-t lg:border-t-0 lg:border-l border-teal-100 p-6">
            <h3 className="text-2xl my-2 font-black text-teal-900">Ingredientes</h3>
            <div className="space-y-2 mt-4">
                {ingredients.map((ingredient, index) => (
                    <p key={`${ingredient.name}-${index}`} className="text-teal-800 font-semibold bg-teal-50 rounded-lg px-3 py-2 border border-teal-100">
                        {ingredient.name} - {ingredient.amount} {ingredient.unit}
                    </p>
                ))}
            </div>
        </aside>
    );
};
