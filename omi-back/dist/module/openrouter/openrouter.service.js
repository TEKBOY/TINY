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
exports.OpenrouterService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let OpenrouterService = class OpenrouterService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.apiKey = this.configService.get('OPENROUTER_API_KEY');
    }
    async extractTitle(transcription) {
        const prompt = `Extrais un titre court pour cet enregistrement : "${transcription}". Réponds uniquement par le titre.`;
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post('https://openrouter.ai/api/v1/completions', {
            model: 'gpt-3.5-turbo',
            prompt,
            max_tokens: 20,
            temperature: 0.5,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
        }));
        if (response.status !== 200) {
            throw new common_1.HttpException(response.data, response.status);
        }
        return response.data.choices[0].text.trim();
    }
};
exports.OpenrouterService = OpenrouterService;
exports.OpenrouterService = OpenrouterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], OpenrouterService);
//# sourceMappingURL=openrouter.service.js.map