import { User } from "../../auth/interfaces/user.interface"

export interface Item {
    nombreItem: string
    fechaItem?: string
    diasItem?: string
    statusItem?: boolean
    issuer?: string
    user?: User

}