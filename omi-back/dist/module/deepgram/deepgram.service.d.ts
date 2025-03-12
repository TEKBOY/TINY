import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class DeepgramService {
    private readonly httpService;
    private readonly configService;
    private readonly apiKey;
    constructor(httpService: HttpService, configService: ConfigService);
    transcribeFromFile(filePath: string): Promise<any>;
}
