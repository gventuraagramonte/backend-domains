import { User } from "../../auth/interfaces/user.interface"

export class CreateItemDto {
    nombreItem: string
    fechaItem?: string
    diasItem?: string
    statusItem?: boolean
    issuer?: string
    user?: User
}
