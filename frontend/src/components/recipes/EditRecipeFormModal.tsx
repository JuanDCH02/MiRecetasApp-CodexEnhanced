import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { recipeTags, type CreateRecipeFormValues } from '../../types';
import { useFieldArray, useForm } from 'react-hook-form';
import { getRecipeById, updateRecipe } from '../../services/RecipeApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditRecipeFormModal() {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['recipeDataEdit', recipeId],
        queryFn: () => getRecipeById(recipeId!)
    });

    const [image, setImage] = useState('');
    const [selectedTag, setSelectedTag] = useState<string[]>([]);
    const presetName = 'mcpkucis';

    const { reset, handleSubmit, register, control, formState: { errors } } = useForm<CreateRecipeFormValues>({
        defaultValues: {
            title: '',
            cookTime: 0,
            portions: 0,
            tags: [],
            image: '',
            steps: [{ step: '' }],
            ingredients: [{ name: '', amount: 0, unit: 'gr' }]
        }
    });

    useEffect(() => {
        if (!data) return;

        setSelectedTag(data.tags);
        setImage(data.image);
        reset({
            title: data.title,
            cookTime: data.cookTime,
            portions: data.portions,
            tags: data.tags,
            image: data.image,
            steps: data.steps,
            ingredients: data.ingredients
        });
    }, [data, reset]);

    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control,
        name: 'steps'
    });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control,
        name: 'ingredients'
    });

    const handleToggleTag = (tag: string) => {
        setSelectedTag((prev) => {
            if (prev.includes(tag)) return prev.filter((item) => item !== tag);
            if (prev.length >= 5) return prev;
            return [...prev, tag];
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const body = new FormData();
        body.append('file', files[0]);
        body.append('upload_preset', presetName);

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dhpxh63m1/image/upload', {
                method: 'POST',
                body
            });
            const file = await response.json();
            setImage(file.secure_url);
        } catch (error) {
            toast.error('Error al subir imagen');
        }
    };

    const { mutate, isPending } = useMutation({
        mutationFn: updateRecipe,
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(data) {
            toast.success(data);
            navigate('/recipes/my-recipes');
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['userRecipes'] });
        }
    });

    const onSubmit = (formData: CreateRecipeFormValues) => {
        mutate({ formData: { ...formData, tags: selectedTag, image }, id: recipeId! });
    };

    if (isLoading) {
        return <p className="text-center text-lg text-gray-600">Cargando receta...</p>;
    }

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-panel w-full max-w-4xl space-y-3 p-4 sm:p-5 rounded-2xl max-h-[calc(100vh-140px)] overflow-y-auto"
            >
                <h2 className="text-3xl font-black text-teal-900">Editar receta</h2>

                <label className="font-semibold text-teal-900">Nombre de la receta</label>
                <input type="text" {...register('title', { required: true })} className="p-2.5 border border-teal-200 rounded-xl w-full bg-white" />
                {errors.title ? <span className="text-red-500">Este campo es obligatorio</span> : null}

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="font-semibold text-teal-900">Tiempo de preparación</label>
                        <input type="number" {...register('cookTime', { required: true })} className="p-2.5 border border-teal-200 rounded-xl block w-full bg-white" />
                    </div>
                    <div>
                        <label className="font-semibold text-teal-900">Porciones</label>
                        <input type="number" {...register('portions')} className="p-2.5 border border-teal-200 rounded-xl block w-full bg-white" />
                    </div>
                </div>

                <label className="font-semibold text-teal-900">Selecciona máximo 5 tags</label>
                <div className="flex flex-wrap gap-2">
                    {recipeTags.map((tag) => (
                        <button
                            key={tag}
                            className={`border border-teal-200 rounded-full px-3 py-1 capitalize ${selectedTag.includes(tag) ? 'bg-teal-700 text-white' : 'bg-white'}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleTag(tag);
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <label className="font-semibold text-teal-900">Pasos a seguir</label>
                {stepFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            {...register(`steps.${index}.step`, { required: true })}
                            placeholder={`Paso ${index + 1}`}
                            className="p-2.5 border border-teal-200 rounded-xl w-full bg-white"
                        />
                        <button type="button" onClick={() => removeStep(index)} className="text-red-600 font-bold text-2xl cursor-pointer">
                            x
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => appendStep({ step: '' })} className="text-teal-700 font-bold text-lg block cursor-pointer">
                    + Añadir paso
                </button>

                <label className="font-semibold text-teal-900">Ingredientes</label>
                {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex flex-wrap items-center gap-2 mb-2">
                        <input {...register(`ingredients.${index}.name`, { required: true })} placeholder="Ej: Papa" className="border p-2 rounded-xl flex-1 min-w-36 bg-white" />
                        <input type="number" {...register(`ingredients.${index}.amount`, { valueAsNumber: true })} placeholder="200" className="border p-2 rounded-xl w-24 bg-white" />
                        <select {...register(`ingredients.${index}.unit`)} className="border p-2 rounded-xl bg-white">
                            <option value="gr">gr</option>
                            <option value="ml">ml</option>
                            <option value="unidad">unidad</option>
                            <option value="cucharada">cucharada</option>
                        </select>
                        <button type="button" onClick={() => removeIngredient(index)} className="text-red-600 font-bold text-2xl cursor-pointer">
                            x
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendIngredient({ name: '', amount: 0, unit: 'gr' })}
                    className="text-teal-700 font-bold text-lg block cursor-pointer"
                >
                    + Añadir ingrediente
                </button>

                <label className="font-semibold text-teal-900">Imagen</label>
                <div className="md:flex gap-3 items-start">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border border-teal-200 rounded-xl md:w-1/2 bg-white" />
                    {image ? <img src={image} alt="imagen subida" className="mt-4 max-h-40 rounded-xl" /> : null}
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-orange-500 text-white font-bold px-5 py-2 rounded-full hover:bg-orange-600 disabled:opacity-70 cursor-pointer"
                    >
                        {isPending ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white font-bold px-5 py-2 rounded-full hover:bg-gray-600 cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        Cerrar
                    </button>
                </div>
            </form>
        </div>
    );
}
