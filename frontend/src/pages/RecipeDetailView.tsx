import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { getRecipeById } from "../services/RecipeApi"
import { Title } from "../components/Title"
import { CommentList } from "../components/comments/CommentList"
import { IngredientList } from "../components/recipes/IngredientList"

export const RecipeDetailView = () => {

    const {recipeId} = useParams()

    const {data, isLoading} = useQuery({
        queryKey: ['recipeData', recipeId],
        queryFn: ()=> getRecipeById(recipeId!)
    })

    

    if(data)return (
        <>
            {isLoading && <Title>Cargando ...</Title>}
            <section className="md:flex bg-white my-10 shadow-md w-full">
                
                <div className="w-full ">
                    <h1 className="text-5xl text-center font-black text-shadow-md/20 text-teal-600 my-5 
                    capitalize">
                        {data.title}
                    </h1>
                    <img src={data.image} alt="imagen-referencia" 
                        className="w-1/2 mx-auto shadow"
                    />
                    
                    <p className="text-center font-bold text-gray-500 mt-3">
                        Tiempo de preparación: {data.cookTime} | Porciones: {data.portions}
                    </p>

                    

                    <div className="text-center my-10 space-y-4">
                        <ol>
                            {data.steps.map(({step}, index) => (
                                
                                <li key={index}
                                    className="text-xl font-bold text-gray-600"
                                    >{index+1}. {step}
                                </li>
                            ))}
                        </ol>
                        <Link to={`/recipes/${recipeId}/add-comment`} 
                            className="p-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-gray-500 
                            border border-gray-400 transition-all "
                            >agregar comentario
                        </Link >
                    </div>

                    
                </div>
                <IngredientList ingredients={data.ingredients}/>
                
            </section>

            <CommentList comments={data.comments}/>
        </>
    )
}
