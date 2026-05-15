import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';

export const RequireGuest = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p className="text-center text-lg font-semibold py-10">Cargando sesión...</p>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
