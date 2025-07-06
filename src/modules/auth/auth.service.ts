import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto, RegisterDto, VerificationDto } from './dto/dto';
import * as bcrypt from 'bcrypt'
import { AppMailerService } from 'src/common/mailer/mailer.service';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService,
        private readonly mailService: AppMailerService,){}

    async register(payload:RegisterDto){
        const user = await this.prisma.user.findFirst({where:{name:payload.name}})
        if(user) throw new ConflictException("Username already exists")

        const verificationCode = Math.floor(100000 + Math.random() * 900000)
        
        await this.mailService.sendVerificationCode(payload.email,payload,verificationCode)
        await this.redisService.set(`register:${payload.email}`, JSON.stringify({...payload,verificationCode}), 900)

        return {
                message:`Verification code sent to ${payload.email}`
        }

    }

    async login(payload:LoginDto){
        const user = await this.prisma.user.findFirst({
            where:{email:payload.email}
        })
        if(!user) {
            throw new NotFoundException("User not registered yet")
        }

        const isMatch = await bcrypt.compare(payload.password,user.password)
        if(!isMatch){
            throw new ConflictException("Password incorrect")
        }

        return {
            message:"Login successfull",
            accesToken:"cfcfjnfjvn"
        }
    }

    async verify(payload:VerificationDto){
        let stored = await this.redisService.get(`register:${payload.email}`)
        
            if(!stored){
                throw new BadRequestException('Verification code expired or not found')
            }
            let userData = JSON.parse(stored)
            
            
            if(userData.verificationCode !== payload.code){
                throw new BadRequestException("Verification code invalid")
            }

            await this.redisService.del(`register:${payload.email}`)
            delete userData.verificationCode

            const password_hash = await bcrypt.hash(userData.password,10)
            let newUser = await this.prisma.user.create({data:{...userData,password:password_hash}})
            
            return {
                success: true,
                message: 'Registiration successfull ',
                data:newUser
            }
    }
}
