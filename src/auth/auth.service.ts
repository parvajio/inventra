import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor (private db: DatabaseService) {}

  async register(registerDto: RegisterDto){
    const {email, username, password} = registerDto;

    const existingUser = await this.db.user.findFirst({
      where: {
        OR:[{email}, {username}]
      },
    })

    if(existingUser){
      throw new ConflictException('User with this email or username already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.db.user.create({
      data:{
        email,
        username, 
        password: hashedPassword
      },
      select:{
        id: true,
        email:true,
        username: true,
        createdAt: true
      }
    })

    return user
  }

  async validateUser(userId: string){
    const user = await this.db.user.findUnique({
      where:{id: userId},
      select:{
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    })

    return user;
  }
}
