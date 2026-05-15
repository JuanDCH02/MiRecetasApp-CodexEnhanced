import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import type { UserRegisterForm } from '../../types';
import ErrorMessage from '../../components/ErrorMessage';
import { createAccount } from '../../services/AuthApi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function RegisterView() {
    const initialValues: UserRegisterForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    };

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegisterForm>({ defaultValues: initialValues });
    const password = watch('password');

    const { mutate, isPending } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
        }
    });

    const handleRegister = (formData: UserRegisterForm) => mutate(formData);

    return (
        <>
            <p className="text-lg text-teal-900 mb-5">Crea tu cuenta y empieza a guardar tus mejores recetas.</p>

            <form onSubmit={handleSubmit(handleRegister)} className="space-y-5" noValidate>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-teal-900" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full p-3 border border-teal-200 rounded-xl bg-white"
                        {...register('email', {
                            required: 'El Email de registro es obligatorio',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'E-mail no válido'
                            }
                        })}
                    />
                    {errors.email ? <ErrorMessage>{errors.email.message}</ErrorMessage> : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-teal-900">Nombre de usuario</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full p-3 border border-teal-200 rounded-xl bg-white"
                        {...register('name', {
                            required: 'El Nombre de usuario es obligatorio'
                        })}
                    />
                    {errors.name ? <ErrorMessage>{errors.name.message}</ErrorMessage> : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-teal-900">Contraseña</label>
                    <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="w-full p-3 border border-teal-200 rounded-xl bg-white"
                        {...register('password', {
                            required: 'La contraseña es obligatoria',
                            minLength: {
                                value: 6,
                                message: 'La contraseña debe ser mínimo de 6 caracteres'
                            }
                        })}
                    />
                    {errors.password ? <ErrorMessage>{errors.password.message}</ErrorMessage> : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-teal-900">Repetir contraseña</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite la contraseña"
                        className="w-full p-3 border border-teal-200 rounded-xl bg-white"
                        {...register('password_confirmation', {
                            required: 'Repetir la contraseña es obligatorio',
                            validate: (value) => value === password || 'Las contraseñas no son iguales'
                        })}
                    />
                    {errors.password_confirmation ? <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage> : null}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-orange-500 hover:bg-orange-600 w-full p-3 text-white font-black text-lg rounded-full cursor-pointer disabled:opacity-70"
                >
                    {isPending ? 'Creando cuenta...' : 'Registrarme'}
                </button>
            </form>

            <nav className="mt-6">
                <Link to={'/auth/login'} className="text-center text-teal-800 font-semibold hover:text-teal-900 block">
                    ¿Ya tienes una cuenta? Ingresa aquí
                </Link>
            </nav>
        </>
    );
}
