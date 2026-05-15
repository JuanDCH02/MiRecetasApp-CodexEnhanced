import { Outlet, Link } from 'react-router-dom';
import { SideBarSection } from '../components/profile/SideBarSection';
import { useAuth } from '../hook/useAuth';

export const AppLayout = () => {
    const { user } = useAuth();

    return (
        <>
            <header className="glass-panel sticky top-0 z-50 border-b border-emerald-100">
                <div className="recipe-shell py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <Link className="text-3xl md:text-4xl font-black text-teal-800 tracking-tight" to={'/'}>
                        Mi Receta App
                    </Link>

                    {!user ? (
                        <div className="flex gap-3">
                            <Link
                                to={'/auth/login'}
                                className="py-2 px-5 border border-teal-700 text-teal-800 font-semibold rounded-full hover:bg-teal-50 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to={'/auth/create-account'}
                                className="py-2 px-5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
                            >
                                Crear Cuenta
                            </Link>
                        </div>
                    ) : null}
                </div>
            </header>

            <div className="recipe-shell">
                <div className="flex flex-col md:flex-row gap-5">
                    {user ? (
                        <aside className="md:w-72 md:sticky md:top-24 md:self-start">
                            <nav className="my-6 glass-panel rounded-2xl">
                                <SideBarSection user={user} />
                            </nav>
                        </aside>
                    ) : null}

                    <main className="flex-1 my-6 pb-24">
                        <Outlet />
                    </main>
                </div>
            </div>

            <footer className="fixed bottom-0 left-0 w-full h-14 flex items-center justify-center text-center text-white font-semibold bg-teal-900/95 z-50 text-sm">
                Juan Clemente todos los derechos reservados
            </footer>
        </>
    );
};
