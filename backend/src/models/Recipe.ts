import mongoose, {Document, PopulatedDoc, Schema, Types} from "mongoose";
import { IUser } from "./User";
import { IComment } from "./Comment";


export interface IRecipe extends Document {
    title: string
    cookTime: number
    portions: number
    tags: string[]
    likesCount: number
    isLiked:boolean
    ingredients: { name: string; amount: number; unit: string }[]
    steps: { step: string }[]
    image: string
    comments: PopulatedDoc<IComment & Document>[]
    author: Types.ObjectId | IUser;
}

const RecipeSchema = new Schema({
    title: { type: String, required: true },
    cookTime: { type: Number, require: true },
    portions: { type: Number, default: 2 },
    tags: [{ type: String, required: true }],
    likesCount: { type: Number, default:0 },
    isLiked: { type: Boolean, default:false},
    ingredients: [{ name: String, amount: Number, unit: String }],
    steps: [{ type: Object, required: true}],
    image: { type: String, required: true },
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    author: { type: Types.ObjectId, ref: 'User' },
})

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema)
export default Recipe;