import { getUser } from '../services/AuthApi';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
    const token = localStorage.getItem('autenticationToken');

    const { data, isError, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: getUser,
        enabled: Boolean(token),
        retry: 0,
        refetchOnWindowFocus: false
    });

    return {
        user: data ?? null,
        isError,
        isLoading: Boolean(token) && isLoading,
        isAuthenticated: Boolean(data)
    };
};
