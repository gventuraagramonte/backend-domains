import {Schema} from 'mongoose'
import { ValidRoles } from '../interfaces'

export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false        
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [ValidRoles.admin, ValidRoles.superUser, ValidRoles.user],
        default: ValidRoles.user
    }

})