import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './core/database/prisma.module';
import { MailerModule } from './common/mailer/mailer.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, MailerModule, RedisModule],
})
export class AppModule {}
