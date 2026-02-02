import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { UserLoginForm } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { authenticate } from "../../services/AuthApi";
import { toast } from "sonner";

export default function LoginView() {

   const navigate = useNavigate()
   const { register, handleSubmit,reset, formState: { errors } } = useForm<UserLoginForm>()
   const { mutate } = useMutation({
        mutationFn: authenticate,
        onError: (error) => { toast.error(error.message) },
        onSuccess: () => {
        toast.success('Iniciando sesión')
        reset()
        navigate('/')
    }
    })
    const handleLogin = (formData: UserLoginForm) => mutate(formData)
   

    return (
    <>
      
        <p className="text-2xl font-light text-white mt-5">
            Llena el formulario para
            <span className=" text-teal-300 font-bold text-shadow-lg/20"> iniciar sesión</span>
        </p>
        <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-5 p-10 bg-white mt-5"
            noValidate
        >
        
        <div className="flex flex-col gap-5">
            <label
                className="text-2xl"
                >Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="w-full p-3  border-gray-300 border"
              {...register("email", {
                required: "El Email es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
        </div>

        <div className="flex flex-col gap-5">
            <label className="text-2xl"
              >Contraseña
        </label>

            <input
                type="password"
                placeholder="Password de Registro"
                className="w-full p-3  border-gray-300 border"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
            />
            {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
        </div>

        <input
            type="submit"
            value='Iniciar Sesión'
            className="bg-indigo-500 hover:bg-indigo-800 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
        </form>

        <nav className="mt-10 flex flex-col space-y-3">
              <Link to={`/auth/create-account`}
              className="text-center font-light text-white"
                  >¿No tienes una cuenta? Registrate aquí
              </Link>
        </nav> 
    </>
    )
}