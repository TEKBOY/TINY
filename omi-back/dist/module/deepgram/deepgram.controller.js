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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepgramController = void 0;
const common_1 = require("@nestjs/common");
const deepgram_service_1 = require("./deepgram.service");
const openrouter_service_1 = require("../openrouter/openrouter.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const common_2 = require("@nestjs/common");
let DeepgramController = class DeepgramController {
    constructor(deepgramService, openrouterService) {
        this.deepgramService = deepgramService;
        this.openrouterService = openrouterService;
    }
    async generateTitle(transcription) {
        const title = await this.openrouterService.extractTitle(transcription);
        return { title };
    }
    async transcribe(audioUrl) {
        const transcriptionData = await this.deepgramService.transcribeFromFile(audioUrl);
        const transcription = transcriptionData.results.channels[0].alternatives[0].transcript;
        return { transcription };
    }
    async uploadAndTranscribe(file) {
        if (!file) {
            throw new common_2.HttpException('Aucun fichier reçu', common_2.HttpStatus.BAD_REQUEST);
        }
        console.log('Fichier reçu:', file);
        const deepgramResponse = await this.deepgramService.transcribeFromFile(file.path);
        console.log('deepgramResponse:', JSON.stringify(deepgramResponse, null, 2));
        const transcript = deepgramResponse.results.channels[0].alternatives[0].transcript;
        console.log('Transcript final:', transcript);
        return { transcription: transcript };
    }
};
exports.DeepgramController = DeepgramController;
__decorate([
    (0, common_1.Post)('generate-title'),
    __param(0, (0, common_1.Body)('transcription')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeepgramController.prototype, "generateTitle", null);
__decorate([
    (0, common_1.Post)('transcribe'),
    __param(0, (0, common_1.Body)('audioUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeepgramController.prototype, "transcribe", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeepgramController.prototype, "uploadAndTranscribe", null);
exports.DeepgramController = DeepgramController = __decorate([
    (0, common_1.Controller)('deepgram'),
    __metadata("design:paramtypes", [deepgram_service_1.DeepgramService,
        openrouter_service_1.OpenrouterService])
], DeepgramController);
//# sourceMappingURL=deepgram.controller.js.map