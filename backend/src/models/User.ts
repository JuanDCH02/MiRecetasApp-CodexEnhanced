import mongoose, {Document, Schema, Types} from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId
    name: string
    email: string
    password: string
    favorites: Types.ObjectId[]
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: Types.ObjectId, ref: 'Recipe' }],
})

const User = mongoose.model<IUser>('User', UserSchema )
export default User;
