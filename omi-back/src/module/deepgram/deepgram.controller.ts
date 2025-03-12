import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DeepgramService } from './deepgram.service';
import { OpenrouterService } from '../openrouter/openrouter.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UploadedFile as UploadedFileInterface } from './upload-file.interface';

@Controller('deepgram')
export class DeepgramController {
    constructor(
        private readonly deepgramService: DeepgramService,
        private readonly openrouterService: OpenrouterService,
    ) {}

    @Post('generate-title')
    async generateTitle(@Body('transcription') transcription: string): Promise<{ title: string }> {
        const title = await this.openrouterService.extractTitle(transcription);
        return { title };
    }

    @Post('transcribe')
    async transcribe(@Body('audioUrl') audioUrl: string) {
      const transcriptionData = await this.deepgramService.transcribeFromFile(audioUrl);
      const transcription = transcriptionData.results.channels[0].alternatives[0].transcript;
      return { transcription };
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('audio', {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    }),
    }))
    async uploadAndTranscribe(@UploadedFile() file: UploadedFileInterface) {
        if (!file) {
            throw new HttpException('Aucun fichier reçu', HttpStatus.BAD_REQUEST);
        }
        console.log('Fichier reçu:', file);
        const deepgramResponse = await this.deepgramService.transcribeFromFile(file.path);
        console.log('deepgramResponse:', JSON.stringify(deepgramResponse, null, 2));
        const transcript = deepgramResponse.results.channels[0].alternatives[0].transcript;
        console.log('Transcript final:', transcript);
        return { transcription: transcript };
    }
}
