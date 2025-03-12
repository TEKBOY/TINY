import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';


@Injectable()
export class DeepgramService {
    private readonly apiKey: string;

    constructor (
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('DEEPGRAM_API_KEY');
    }

    async transcribeFromFile(filePath: string): Promise<any> {
        const fileBuffer = fs.readFileSync(filePath);
        const requestUrl = 'https://api.deepgram.com/v1/listen';
        const headers = {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'audio/m4a',
        };
      
        try {
          const response = await lastValueFrom(
            this.httpService.post(requestUrl, fileBuffer, {
              headers,
              params: {
                punctuate: true,
                language: 'fr',
                model: 'nova-2'
              }
            })
          );
          return response.data;
        } catch (error) {
          console.error('Erreur Deepgram:', error.response?.data || error.message);
          throw new HttpException(
            error.response?.data || 'Erreur lors de la transcription',
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
    }  
}
