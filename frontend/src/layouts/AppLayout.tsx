import { Outlet, Link } from "react-router-dom"
import { SideBarSection } from "../components/profile/SideBarSection"
import { useAuth } from "../hook/useAuth"



export const AppLayout = () => {
    const {data: user} = useAuth()
    
    return (
        <>
            <header className="w-full bg-teal-600 py-6 px-4 flex justify-around items-center">
                <div>
                    <Link className="text-white text-5xl font-black p-4" to={'/'}>
                        Mi Receta App
                    </Link>
                </div>

                <div className="flex gap-4">
                    {!user && (
                        <>
                        <Link to={ '/auth/login'}
                            className="py-2 px-5 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 cursor-pointer"
                            >Login
                        </Link>
                        <Link to={'/auth/create-account'}
                            className="py-2 px-5 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 cursor-pointer"
                            >Crear Cuenta
                        </Link>
                        </>
                    )}
                    
                </div>
            </header>

            <div>
                <div className="flex">
                    {/* sidebar sticky en pantallas md+ */}
                    <aside className="md:w-72 border-r border-r-gray-300 md:sticky md:top-0 md:h-screen">
                        <nav className="my-10">
                            <SideBarSection user={user!} />
                        </nav>
                    </aside>

                    {/* main ocupa el resto, con padding-bottom igual a la altura del footer (h-16 -> pb-16)
                        y overflow-auto para que el contenido haga scroll sin tapar el footer */}
                    <main className="flex-1 my-10 max-w-7xl mx-auto pb-16 overflow-auto">
                        <Outlet />
                    </main>
                </div>

                {/* footer fijo: si cambias h-16, actualizar pb-16 en main arriba */}
                <footer className="fixed bottom-0 left-0 w-full h-16 flex items-center justify-center text-center text-white font-semibold bg-teal-900 z-50">
                    Juan Clemente todos los derechos reservados
                </footer>
            </div>
        </>
    )
}
