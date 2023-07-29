import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt'
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel('User') 
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,

      ){}

    async create(createUserDto:CreateUserDto){
        const {password, ...userData} = createUserDto
        try {
            const user = await this.userModel.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            })
            delete user.password

            // TODO: Retornar el JWT de acceso
            return {
                email: user.email,
                password: user.password,
                token: this.getJwtToken({email: user.email})
            }

        } catch (error) {
            this.handleDBErrors(error)
        }

    }

    async login(loginUserDto: LoginUserDto){
        const {password, email} = loginUserDto

        // Trae los campos especificos para usarlos
        const user = await this.userModel.findOne({email},{password:1, email:1})

        if(!user)
            throw new UnauthorizedException('Credentiales are not valid')

        if(!bcrypt.compareSync(password, user.password))
            throw new UnauthorizedException('Credentiales are not valid')

        return {
            email: user.email,
            password: user.password,
            token: this.getJwtToken({email: user.email})
        }
        // TODO: Retornar el JWT
    }

    private getJwtToken(payload: JwtPayload){
        // Firmo los tokens validos
        const token = this.jwtService.sign(payload)
        return token
    }



    private handleDBErrors(error:any):never{
        if(error.code === 11000)
            throw new BadRequestException('Duplicate key value')
        
        console.error(error)
        throw new InternalServerErrorException('Checklogs')
    }
}
