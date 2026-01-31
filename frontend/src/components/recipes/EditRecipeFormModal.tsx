import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { recipeTags, type CreateRecipeFormValues } from "../../types";
import { useFieldArray, useForm } from "react-hook-form";
import { getRecipeById, updateRecipe } from "../../services/RecipeApi";
import { useNavigate, useParams } from "react-router-dom";


export default function EditRecipeFormModal() {

    const {recipeId} = useParams()
    const navigate = useNavigate()
    const {data} = useQuery({
        queryKey: ['recipeDataEdit', recipeId],
        queryFn: ()=> getRecipeById(recipeId!)
    })

    const [image, setImage] = useState('')
    const preset_name = 'mcpkucis' // preset de Cloudinary
    const [selectedTag, setSelectedTag] = useState<string[]>(data?.tags || [])
    const queryClient = useQueryClient()

    const {reset, handleSubmit, register, control, formState:{errors}} = useForm<CreateRecipeFormValues>({
        defaultValues:{ 
            steps: data ? data.steps : [{step: ''}],
            ingredients: data ? data.ingredients : [{ name: '', amount: 0, unit: 'gr' }] // inicializamos campos
        }
    })

    // FieldArray para pasos
    const {fields: stepFields, append: appendStep, remove: removeStep} = useFieldArray({
        control,
        name:'steps'
    });

    // FieldArray para ingredientes
    const {fields: ingredientFields, append: appendIngredient, remove: removeIngredient} = useFieldArray({
        control,
        name:'ingredients'
    })

    const handleToggleTag = (tag: string) => {
        setSelectedTag(prev => {
            if (prev.includes(tag)) return prev.filter(t => t !== tag);
            if (prev.length >= 5) return prev
            return [...prev, tag]
        })
    }

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
            console.log('file subido',file)
        } catch (error) {
            console.log('error subiendo la imagen',error)
        }
    }
    const {mutate} = useMutation({
        mutationFn: updateRecipe,
        onError(error) {
            toast.error(error.message)
            console.log('error actualizando receta', error)
        },
        onSuccess(data){
            toast.success(data)
            reset()
            setSelectedTag([])
            setImage('')
            navigate(`/recipes/my-recipes`)
            queryClient.invalidateQueries({queryKey:['recipes', recipeId]})
            queryClient.invalidateQueries({queryKey:['userRecipes']})
        }
    });

    const onSubmit = (formData : CreateRecipeFormValues)=> {
        mutate({ formData: { ...formData, tags: selectedTag }, id: recipeId! })
    }
    

    return (
        <>
        {/* {console.log(data)} */}
            <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-51">
                <form onSubmit={handleSubmit(onSubmit)}
                       className="mt-10 w-5/6 lg:max-w-6xl mx-auto shadow-lg bg-white space-y-4 p-4 rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto"
                   >
                        {/* --- CAMPOS BÁSICOS --- */}
                        <label>Nombre de la receta:</label>
                        <input type="text" {...register("title", { required: true })}
                            className="p-2 border rounded-lg w-full"
                            defaultValue={data?.title}
                        />
                        {errors.title && <span className="text-red-500">Este campo es obligatorio</span>}
            
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label>Tiempo de preparación:</label>
                                <input type="number" {...register("cookTime", { required: true })}
                                    className="p-2 border rounded-lg block w-full"
                                    defaultValue={data?.cookTime}
                                />
                            </div>
                            <div>
                                <label>Porciones:</label>
                                <input type="number" {...register("portions")}
                                    className="p-2 border rounded-lg block w-full"
                                    defaultValue={data?.portions}
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
                                    className="p-2 border rounded-lg w-full"
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
                            <div key={field.name} className="flex items-center gap-2 mb-2">
                                <input
                                    {...register(`ingredients.${index}.name`, { required: true })}
                                    placeholder="Ej: Papa"
                                    className="border p-2 rounded w-1/2"
                                />
                                <input
                                    type="number"
                                    {...register(`ingredients.${index}.amount`, { valueAsNumber: true })}
                                    placeholder="200"
                                    className="border p-2 rounded w-24"
                                />
                                <select {...register(`ingredients.${index}.unit`)} className="border p-2 rounded">
                                    <option value="gr">gr</option>
                                    <option value="ml">ml</option>
                                    <option value="unidad">unidad</option>
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
                        <div className="md:flex gap-3">
                            <input type="file" accept="image/*" onChange={handleFileChange}
                                placeholder="Sube la imagen de tu receta"
                                className="p-2 border rounded-lg md:w-1/2 "
                            />
                            {image? <img src={image} alt="imagen subida" className="mt-4 max-h-48 rounded-lg"/> : ''}
                        </div>
                       
                        {/* --- SUBMIT --- */}
                         <div className="flex gap-3">
                             <button type="submit"
                                 className="bg-indigo-500 text-white font-bold px-4 py-2 rounded hover:bg-indigo-600 cursor-pointer"
                                 >Editar
                             </button>
                             <button type="button" className="bg-gray-500 text-white font-bold px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                                    onClick={() => navigate(-1)}
                                 >Cerrar
                             </button>
                         </div>
                       
                </form>
            </div>
        
        
        </>
    )
}
