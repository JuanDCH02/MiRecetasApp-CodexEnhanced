import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { UserLoginForm } from '../../types';
import ErrorMessage from '../../components/ErrorMessage';
import { useMutation } from '@tanstack/react-query';
import { authenticate } from '../../services/AuthApi';
import { toast } from 'sonner';

export default function LoginView() {
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserLoginForm>();

    const { mutate, isPending } = useMutation({
        mutationFn: authenticate,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Iniciando sesión');
            reset();
            navigate('/');
        }
    });

    const handleLogin = (formData: UserLoginForm) => mutate(formData);

    return (
        <>
            <p className="text-lg text-teal-900 mb-5">Inicia sesión para acceder a tus recetas y favoritos.</p>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-teal-900">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full p-3 border border-teal-200 rounded-xl bg-white"
                        {...register('email', {
                            required: 'El Email es obligatorio',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'E-mail no válido'
                            }
                        })}
                    />
                    {errors.email ? <ErrorMessage>{errors.email.message}</ErrorMessage> : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-teal-900">Contraseña</label>
                    <input
                        type="password"
                        placeholder="Tu contraseña"
                        className="w-full p-3 border border-teal-200 rounded-xl bg-white"
                        {...register('password', {
                            required: 'La contraseña es obligatoria'
                        })}
                    />
                    {errors.password ? <ErrorMessage>{errors.password.message}</ErrorMessage> : null}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-orange-500 hover:bg-orange-600 w-full p-3 text-white font-black text-lg rounded-full cursor-pointer disabled:opacity-70"
                >
                    {isPending ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
            </form>

            <nav className="mt-6">
                <Link to={'/auth/create-account'} className="text-center text-teal-800 font-semibold hover:text-teal-900 block">
                    ¿No tienes una cuenta? Regístrate aquí
                </Link>
            </nav>
        </>
    );
}
