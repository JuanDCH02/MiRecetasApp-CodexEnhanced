import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        <section className="min-h-screen bg-[linear-gradient(145deg,#0f766e_0%,#0b4f4a_55%,#083a36_100%)] px-4 py-10">
            <div className="mx-auto max-w-md">
                <h1 className="text-white text-5xl font-black tracking-tight">Mi Receta App</h1>
                <p className="text-emerald-100 mt-3">Tu recetario personal para guardar, editar y compartir recetas.</p>

                <div className="mt-8 glass-panel rounded-3xl p-6 sm:p-8">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};
