import { useState } from "react";
import { recipeTags, type CreateRecipeFormValues } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRecipe } from "../../services/RecipeApi";
import { useForm, useFieldArray } from "react-hook-form";

export default function AddRecipeForm() {

    const [selectedTag, setSelectedTag] = useState<string[]>([])
    const [image, setImage] = useState('')
    const preset_name = 'mcpkucis' // preset de Cloudinary

    
    const {reset, handleSubmit, register, control, formState:{errors}} = useForm<CreateRecipeFormValues>({
        defaultValues: {
            title: '',
            cookTime: 0,
            portions: 0,
            image: '',
            tags: [],
            steps: [{step: ''}],
            ingredients: [{ name: '', amount: 0, unit: 'gr' }]
        }
    })

    // FieldArray para pasos
    const {
      fields: stepFields, append: appendStep, remove: removeStep
        } = useFieldArray<CreateRecipeFormValues, "steps">({
      control,
      name: "steps"
    })
    
    // FieldArray para ingredientes
    const {
      fields: ingredientFields, append: appendIngredient, remove: removeIngredient
        } = useFieldArray<CreateRecipeFormValues, "ingredients">({
      control,
      name: "ingredients"
    })

    const handleToggleTag = (tag: string) => {
        setSelectedTag(prev => {
            if (prev.includes(tag)) return prev.filter(t => t !== tag);
            if (prev.length >= 5) return prev
            return [...prev, tag]
        })
    }

    const queryClient = useQueryClient()
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', preset_name )
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dhpxh63m1/image/upload`, {
                method: 'POST',
                body: data
            })
            const file = await response.json()
            setImage(file.secure_url)
        } catch (error) {
            console.log('error subiendo la imagen',error)
        }
    }

    const {mutate} = useMutation({
        mutationFn: createRecipe,
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(data){
            toast.success(data)
            reset()
            setSelectedTag([])
            setImage('')
            queryClient.invalidateQueries({queryKey:['recipes']})
        }
    })

    const onSubmit = (formData : CreateRecipeFormValues)=> {
        if(!image){
            toast.error('La imagen es obligatoria');
            return
        }
        mutate({ ...formData, tags: selectedTag, image: image});
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}
        className="mt-10 w-5/6 lg:max-w-6xl mx-auto shadow-lg bg-white space-y-4 p-4 rounded-lg"
        >
            {/* --- CAMPOS BÁSICOS --- */}
            <label>Nombre de la receta:</label>
            <input type="text" {...register("title", { required: true })}
                className="p-2 border rounded-lg w-full bg-white"
            />
            {errors.title && <span className="text-red-500">Este campo es obligatorio</span>}

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label>Tiempo de preparación:</label>
                    <input type="number" {...register("cookTime", { required: true })}
                        className="p-2 border rounded-lg block w-full bg-white"
                    />
                </div>
                <div>
                    <label>Porciones:</label>
                    <input type="number" {...register("portions")}
                        className="p-2 border rounded-lg block w-full bg-white"
                    />
                </div>
            </div>

            {/* --- TAGS --- */}
            <label>Seleccione máximo 5 tags:</label>
            <div>
                {recipeTags.map(tag=> (
                    <button key={tag}
                        className={`border border-gray-400 rounded p-1 my-1 mx-1 
                            ${selectedTag.includes(tag) ? 'bg-green-200' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleToggleTag(tag); }}
                        >{tag}
                    </button>
                ))}
            </div>

            {/* --- PASOS --- */}
            <label>Pasos a seguir:</label>
            {stepFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input type="text"
                        {...register(`steps.${index}.step`, {required:true})}
                        placeholder={`Paso ${index + 1}`}
                        className="p-2 border rounded-lg w-full bg-white"
                    />
                    <button type="button"
                        onClick={()=> removeStep(index)}
                        className="text-red-600 font-bold text-2xl cursor-pointer"
                        >x
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => appendStep({step: ''})}
                className="text-indigo-500 font-bold text-lg block cursor-pointer"
                >+ Añadir paso
            </button>

            {/* --- INGREDIENTES --- */}
            <label>Ingredientes a usar:</label>
            {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input
                        {...register(`ingredients.${index}.name`, { required: true })}
                        placeholder="Ej: Papa"
                        className="border p-2 rounded w-1/2 bg-white"
                    />
                    <input
                        type="number"
                        {...register(`ingredients.${index}.amount`, { valueAsNumber: true })}
                        placeholder="200"
                        className="border p-2 rounded w-24 bg-white"
                    />
                    <select {...register(`ingredients.${index}.unit`)} className="border p-2 rounded bg-white">
                        <option value="gr">gr</option>
                        <option value="ml">ml</option>
                        <option value="unidad">unidad</option>
                        <option value="cucharada">cucharada</option>
                    </select>
                    <button type="button" onClick={() => removeIngredient(index)} 
                        className="text-red-600 font-bold text-2xl cursor-pointer"
                        >x
                    </button>
                </div>
            ))}
            <button type="button"
                onClick={() => appendIngredient({ name: '', amount: 0, unit: 'gr' })}
                className="text-indigo-500 font-bold text-lg block cursor-pointer"
                >+ Añadir ingrediente
            </button>

            {/* --- CARGAR IMAGEN --- */}
            <label >Imagen:</label>
            <div>
                <input type="file" accept="image/*" onChange={handleFileChange}
                    placeholder="Sube la imagen de tu receta"
                    className="p-2 border rounded-lg md:w-1/2 bg-white"
                />
                {image? <img src={image} alt="imagen subida" className="mt-4 max-h-48 rounded-lg"/> : ''}
            </div>

            {/* --- SUBMIT --- */}
            <button type="submit"
                className="bg-indigo-500 text-white font-bold px-4 py-2 rounded hover:bg-indigo-600 cursor-pointer"
                >Crear
            </button>
        </form>
    )
}
