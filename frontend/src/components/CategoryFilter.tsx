import { recipeTags } from '../types';

interface CategoryFilterProps {
    onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ onCategoryChange }: CategoryFilterProps) => {
    const handleChange = (e: { target: { value: string } }) => {
        onCategoryChange(e.target.value);
    };

    return (
        <section className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-teal-700 font-semibold">Descubre</p>
                <h2 className="font-black text-2xl text-teal-900">Filtra según tus gustos</h2>
            </div>

            <select
                className="w-full sm:w-72 bg-white rounded-xl p-3 border border-teal-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                onChange={handleChange}
            >
                <option value="todas">Todas</option>
                {recipeTags.map((tag) => (
                    <option key={tag} value={tag} className="capitalize">
                        {tag}
                    </option>
                ))}
            </select>
        </section>
    );
};
