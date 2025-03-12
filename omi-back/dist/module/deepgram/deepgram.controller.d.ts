import { DeepgramService } from './deepgram.service';
import { OpenrouterService } from '../openrouter/openrouter.service';
import { UploadedFile as UploadedFileInterface } from './upload-file.interface';
export declare class DeepgramController {
    private readonly deepgramService;
    private readonly openrouterService;
    constructor(deepgramService: DeepgramService, openrouterService: OpenrouterService);
    generateTitle(transcription: string): Promise<{
        title: string;
    }>;
    transcribe(audioUrl: string): Promise<{
        transcription: any;
    }>;
    uploadAndTranscribe(file: UploadedFileInterface): Promise<{
        transcription: any;
    }>;
}
