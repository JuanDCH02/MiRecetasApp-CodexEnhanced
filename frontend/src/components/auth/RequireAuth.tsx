import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';

export const RequireAuth = () => {
    const location = useLocation();
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p className="text-center text-lg font-semibold py-10">Cargando sesión...</p>;
    }

    if (!user) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};
