import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MatchesModule } from './matches/matches.module';
import { FilesModule } from './files/files.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, MatchesModule, FilesModule, FileModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
