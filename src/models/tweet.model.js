import { Schema,model } from "mongoose";

const tweetSchema = new Schema(
    {
        owener:{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        content:{
            type:String,
            required:true
        }
    },
    {
    timestamps:true
    }
)

export const Tweet = ("Tweet", tweetSchema)