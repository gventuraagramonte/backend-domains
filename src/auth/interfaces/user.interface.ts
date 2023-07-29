import { ValidRoles } from "./valid-roles.interface"

export interface User {
    email: string
    password: string
    role: ValidRoles
}