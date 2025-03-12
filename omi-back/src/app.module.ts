import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeepgramModule } from './module/deepgram/deepgram.module';
import { ConfigModule } from '@nestjs/config';
import { OpenrouterModule } from './module/openrouter/openrouter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DeepgramModule,
    OpenrouterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
