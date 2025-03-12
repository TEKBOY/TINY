import { Module } from '@nestjs/common';
import { DeepgramService } from './deepgram.service';
import { DeepgramController } from './deepgram.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OpenrouterModule } from '../openrouter/openrouter.module';

@Module({
  imports: [HttpModule, ConfigModule, OpenrouterModule],
  providers: [DeepgramService],
  controllers: [DeepgramController],
})
export class DeepgramModule {}