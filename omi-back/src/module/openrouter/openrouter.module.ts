import { Module } from '@nestjs/common';
import { OpenrouterService } from './openrouter.service';
import { OpenrouterController } from './openrouter.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [OpenrouterService],
  controllers: [OpenrouterController],
  exports: [OpenrouterService],
})
export class OpenrouterModule {}