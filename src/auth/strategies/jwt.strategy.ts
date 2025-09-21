import { PassportStrategy } from "@nestjs/passport"
import {Strategy} from 'passport-jwt'
import { AuthService } from "../auth.service"
import { Injectable, UnauthorizedException } from "@nestjs/common"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({

        })
    }
    
    async validate(payload: any){
        const user = await this.authService.validateUser(payload.sub)

        if(!user){
            throw new UnauthorizedException()
        }
        return user;
    }
}