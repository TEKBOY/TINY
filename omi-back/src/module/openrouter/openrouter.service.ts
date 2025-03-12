import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OpenrouterService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
  }

  async extractTitle(transcription: string): Promise<string> {
    const prompt = `Extrais un titre court pour cet enregistrement : "${transcription}". Réponds uniquement par le titre.`;
    const response = await lastValueFrom(this.httpService.post(
      'https://openrouter.ai/api/v1/completions',
      {
        model: 'gpt-3.5-turbo',
        prompt,
        max_tokens: 20,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    ));

    if (response.status !== 200) {
      throw new HttpException(response.data, response.status);
    }

    return response.data.choices[0].text.trim();
  }
}
