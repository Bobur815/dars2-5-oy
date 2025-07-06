import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma:PrismaService){}

    async getAll(){
        const users = await this.prisma.user.findMany()
        return users
    }
}
