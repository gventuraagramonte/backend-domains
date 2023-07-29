import {IsEmail, IsString, MinLength, Matches, MaxLength} from 'class-validator'
import { ValidRoles } from '../interfaces'

export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string

    @IsString()
    @MinLength(10)
    fullName: string

    role: ValidRoles
}