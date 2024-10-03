import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing ( as accessing the referece so have to type Schema.Types.ObjectId) )
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "User"
    }
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)

//how to count no of subscribers of a channel and no of channels subscribed by a user

//in database we have entry subcriber and channel --> when anyone subscribes to a channel then we have to add the entry in the database
// to count number of subscribers of a channel we have to count the number of entries in the database where channel is same

//to count number of channels subscribed by a user we have to count the number of entries in the database where subscriber is user(we want to count the channels subscribed by the user)