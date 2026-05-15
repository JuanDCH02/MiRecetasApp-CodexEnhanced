import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import type { User } from '../../types';

type SideBarSectionProps = {
    user: User;
};

export const SideBarSection = ({ user }: SideBarSectionProps) => {
    const queryClient = useQueryClient();

    const logout = () => {
        localStorage.removeItem('autenticationToken');
        queryClient.removeQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['userRecipes'] });
        queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
        window.location.href = '/';
    };

    const location = useLocation();

    return (
        <div className="bg-white mx-2 rounded-lg h-[710px]">
            <div className="flex flex-col space-y-3 p-4">
                <h3 className="text-3xl font-black my-4">{user.name}</h3>

                <Link
                    className={`${location.pathname === '/create-recipe' ? 'bg-teal-600 p-2 text-white rounded' : ''} text-xl font-bold text-gray-500 border-b border-b-gray-300 hover:text-teal-700`}
                    to={'/create-recipe'}
                >
                    Crear Receta
                </Link>
                <Link
                    className={`${location.pathname === '/recipes/my-recipes' ? 'bg-teal-600 p-2 text-white rounded' : ''} text-xl font-bold text-gray-500 border-b border-b-gray-300 hover:text-teal-700`}
                    to={'/recipes/my-recipes'}
                >
                    Mis Recetas
                </Link>
                <Link
                    className={`${location.pathname === '/recipes/favorites' ? 'bg-teal-600 p-2 text-white rounded' : ''} text-xl font-bold text-gray-500 border-b border-b-gray-300 hover:text-teal-700`}
                    to={'/recipes/favorites'}
                >
                    Mis Favoritos
                </Link>
                <Link
                    className="text-xl font-bold text-gray-500 border-b border-b-gray-300 hover:text-red-800"
                    to={'/'}
                    onClick={logout}
                >
                    Cerrar Sesión
                </Link>
            </div>
        </div>
    );
};
