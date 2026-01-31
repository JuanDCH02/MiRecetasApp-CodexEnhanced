
import { AiOutlineLike } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import type { RecipeCardType } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleFavorites } from '../../services/RecipeApi';
import { useState } from 'react';


type RecipeCardProps = {
    recipe: RecipeCardType
}

export const RecipeCard = ({recipe} : RecipeCardProps) => {
    const queryClient = useQueryClient()
    const [likesCount, setLikesCount] = useState(recipe.likesCount);
    const [isLiked, setIsLiked] = useState(recipe.isLiked);

    const {mutate, isPending} = useMutation({
        mutationFn: toggleFavorites,
        onError(error){
            toast.error(error.message)
        },
        onSuccess(data){
            toast.success(data?.message)
            setLikesCount(data!.likesCount);
            setIsLiked((prev) => !prev);
            queryClient.invalidateQueries({queryKey:['recipes', 'userFavorites', 'userRecipes']})
        }
    })
    
    return (
        
        <div className="bg-white border border-gray-300 p-4 w-72 h-[410px] mb-3 rounded-lg shadow space-y-3 
        hover:scale-102 hover:transition-all hover:bg-indigo-100 hover:shadow-lg">
            

            <div>
                <img src={recipe.image} alt="imagen-receta"
                className="rounded " />
            </div>

            <div className='mb-2'>
                <h3 className="font-bold text-lg text-center capitalize border-b border-indigo-800 mb-2"
                    >{recipe.title}
                </h3>
                <p className="font-semibold">Tiempo preparación: {recipe.cookTime}</p>
                <p className="font-semibold">Porciones: {recipe.portions}</p>
                <p className='font-semibold'>Tags:</p>
                <ul className="font-semibold grid grid-cols-2 gap-x-2 gap-y-1">
                    {recipe.tags.map(tag => (
                        <li key={tag} className="break-words text-md">
                            - {tag}
                        </li>
                    ))}
                </ul>
            </div>

            <div className='flex gap-3 justify-between items-center'>
                <div className='flex gap-2'>
                    <AiOutlineLike onClick={() => !isPending && mutate(recipe._id)}
                        className={`hover:cursor-pointer text-xl transition-colors ${
                        isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}` }
                    />
                    <p>Likes: {likesCount} </p>
                </div>
                <div>
                    <Link className='rounded p-1.5 text-indigo-500 font-bold
                    hover:cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors'
                    to={`/recipes/${recipe._id}`}
                        >Ver Detalle
                    </Link>
                </div>
            </div>
            
        </div>
    )
}
