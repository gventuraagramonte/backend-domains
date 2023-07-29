import { ValidRoles } from "./valid-roles.interface"

export interface User {
    email: string
    password: string
    fullName: string
    role: ValidRoles
}