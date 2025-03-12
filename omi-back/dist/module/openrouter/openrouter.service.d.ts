import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class OpenrouterService {
    private readonly httpService;
    private readonly configService;
    private readonly apiKey;
    constructor(httpService: HttpService, configService: ConfigService);
    extractTitle(transcription: string): Promise<string>;
}
