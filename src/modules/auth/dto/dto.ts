import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    password:string

    @IsNotEmpty()
    age:number
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
} 

export class VerificationDto{
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsNumber()
    code: number
}
