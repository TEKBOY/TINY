// import { createClient } from '@deepgram/sdk';

// export class LiveTranscriptionService {
//   constructor(apiKey, options = {}) {
//     this.deepgram = createClient(apiKey);
//     this.options = options;
//     this.ws = null;
//   }

//   startStreaming(onMessage: (transcript: string) => void, onError: (error: any) => void) {
//     this.ws = this.deepgram.transcription.live({
//   config: {
//     punctuate: true,
//     language: 'fr',
//     model: 'nova-2',
//   },
// });

//     this.ws.on('open', () => {
//       console.log('Connexion de streaming ouverte.');
//       // Ici, démarrez la capture audio et l'envoi de chunks (selon votre implémentation)
//     });

//     // La nouvelle version utilise l'événement 'data'
//     this.ws.on('data', (data: any) => {
//       let transcript = '';
//       try {
//         // Selon le type, le SDK peut renvoyer une chaîne ou un objet
//         const parsed = typeof data === 'string' ? JSON.parse(data) : data;
//         transcript = parsed?.channel?.alternatives?.[0]?.transcript;
//       } catch (e) {
//         console.error('Erreur lors du parsing des données de transcription', e);
//       }
//       if (transcript) {
//         onMessage(transcript);
//       }
//     });

//     this.ws.on('error', (error: any) => {
//       console.error('Erreur du streaming:', error);
//       onError(error);
//     });
//   }

//   sendAudioChunk(chunk: any) {
//     if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//       this.ws.send(chunk);
//     }
//   }

//   stopStreaming() {
//     if (this.ws) {
//       this.ws.close();
//       this.ws = null;
//     }
//   }
// }

