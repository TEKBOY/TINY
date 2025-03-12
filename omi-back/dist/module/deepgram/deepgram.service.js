"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepgramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const fs = require("fs");
let DeepgramService = class DeepgramService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.apiKey = this.configService.get('DEEPGRAM_API_KEY');
    }
    async transcribeFromFile(filePath) {
        const fileBuffer = fs.readFileSync(filePath);
        const requestUrl = 'https://api.deepgram.com/v1/listen';
        const headers = {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'audio/m4a',
        };
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(requestUrl, fileBuffer, {
                headers,
                params: {
                    punctuate: true,
                    language: 'fr',
                    model: 'nova-2'
                }
            }));
            return response.data;
        }
        catch (error) {
            console.error('Erreur Deepgram:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data || 'Erreur lors de la transcription', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DeepgramService = DeepgramService;
exports.DeepgramService = DeepgramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], DeepgramService);
//# sourceMappingURL=deepgram.service.js.map