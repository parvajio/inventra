import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class ResisterDto{
    @ApiProperty({example: "parvajio25@gmail.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example: "parvajio"})
    @IsString()
    @MinLength(3)
    username: string
    
    @ApiProperty({example: "passoword23", minLength: 6})
    @IsString()
    @MinLength(3)
    password: string
}

export class LoginDto{
    @ApiProperty({example: "parvajio25@gmail.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example: "passoword23", minLength: 6})
    @IsString()
    @MinLength(3)
    password: string
}