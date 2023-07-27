import { Schema } from "mongoose";


export const ItemSchema = new Schema({
    nombreItem: {
        type: String,
        required: true
    },
    fechaItem: {
        type: String
    },
    diasItem: {
        type: String
    },
    statusItem: {
        type: Boolean
    },
    issuer: {
        type: String
    }
})