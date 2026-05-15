import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { RecipeCardProfile } from '../../types';

type RecipeCardProfileProps = {
    recipe: RecipeCardProfile;
};

export default function RecipeCardProfile({ recipe }: RecipeCardProfileProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const navigate = useNavigate();
    const menuContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isMenuOpen && menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        if (!isMenuOpen && menuContainerRef.current) {
            const rect = menuContainerRef.current.getBoundingClientRect();
            const dropdownHeight = 132;
            const spaceBelow = window.innerHeight - rect.bottom;
            const shouldOpenUpwards = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
            setOpenUpwards(shouldOpenUpwards);
        }

        setIsMenuOpen((prev) => !prev);
    };

    return (
        <div className={`w-full glass-panel rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center p-5 mb-4 gap-4 ${isMenuOpen ? 'relative z-40' : 'relative z-10'}`}>
            <div className="flex flex-col sm:flex-row gap-5 flex-1 w-full">
                <img src={recipe.image} className="w-28 h-28 object-cover rounded-xl" alt="recipe-photo" />
                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-black text-teal-900 mb-2 capitalize">{recipe.title}</h2>
                    <p className="text-teal-800 mb-1 font-medium">Tiempo: {recipe.cookTime} min</p>
                    <p className="text-teal-800 mb-1 font-medium">Porciones: {recipe.portions}</p>
                </div>
            </div>

            <div ref={menuContainerRef} className="relative w-full md:w-auto flex justify-end">
                <button onClick={toggleMenu} className="p-2 hover:bg-teal-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>

                {isMenuOpen && (
                    <div className={`absolute right-0 w-44 border border-teal-100 rounded-xl shadow-lg bg-white z-50 overflow-hidden ${openUpwards ? 'bottom-12' : 'top-12'}`}>
                        <Link to={`/recipes/${recipe._id}`} className="block px-4 py-2 text-sm text-teal-800 hover:bg-teal-50">
                            Ver receta
                        </Link>
                        <Link to={`/recipes/${recipe._id}/edit`} className="block px-4 py-2 text-sm text-teal-800 hover:bg-teal-50">
                            Editar
                        </Link>
                        <button
                            onClick={() => navigate(`/recipes/${recipe._id}/confirm-delete`)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
