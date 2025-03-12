#include <WiFi.h>
#include <BluetoothSerial.h>  // Inclure la bibliothèque pour Bluetooth
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

bool isRecording = false;
bool lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
WiFiClient client;

const int bufferSize = 1024; // Taille du buffer pour stocker les échantillons audio
int audioBuffer[bufferSize];  // Tableau pour stocker les échantillons audio

BluetoothSerial BTSerial;  // Instance pour la communication Bluetooth

void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN, OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    connectToWiFi();  // Connexion au Wi-Fi

    if (BLUETOOTH_ENABLED) {
        if (!BTSerial.begin(BT_SERVER_NAME)) {
            Serial.println("Échec de l'initialisation Bluetooth");
        } else {
            Serial.println("Bluetooth prêt");
        }
    }
}

void loop() {
    handleButtonPress();

    if (isRecording) {
        captureAudio();
        sendAudioData();  // Envoi des données audio via Wi-Fi ou Bluetooth
    }
    delay(10);
}

void connectToWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connexion WiFi en cours");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnecté au WiFi !");
}

void handleButtonPress() {
    bool buttonState = digitalRead(BUTTON_PIN);
    if (buttonState == LOW && lastButtonState == HIGH && (millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
        isRecording = !isRecording;
        Serial.println(isRecording ? "Enregistrement ACTIVÉ" : "Enregistrement DÉSACTIVÉ");
        digitalWrite(LED_PIN, isRecording ? HIGH : LOW);
        lastDebounceTime = millis();
    }
    lastButtonState = buttonState;
}

void captureAudio() {
    Serial.println("Capture audio en cours...");
    
    for (int i = 0; i < bufferSize; i++) {
        audioBuffer[i] = analogRead(MIC_PIN); // Capture d'un échantillon audio
        delayMicroseconds(50); // Ajuster en fonction du débit d'échantillonnage souhaité
    }
}

void sendAudioData() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(SERVER_URL);  // Envoi via Wi-Fi
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<2048> jsonDoc; // Adapter la taille selon le buffer
        JsonArray audioArray = jsonDoc.createNestedArray("audio_samples");
        
        for (int i = 0; i < bufferSize; i++) {
            audioArray.add(audioBuffer[i]); // Ajout des échantillons au JSON
        }
        
        jsonDoc["mode"] = "streaming";
        
        String payload;
        serializeJson(jsonDoc, payload);

        int httpResponseCode = http.POST(payload);
        
        if (httpResponseCode > 0) {
            Serial.println("Données envoyées avec succès via Wi-Fi!");
        } else {
            Serial.println("Erreur lors de l'envoi des données via Wi-Fi");
        }

        http.end();
    }

    // Si Bluetooth est activé, envoyer les données par Bluetooth
    if (BLUETOOTH_ENABLED && BTSerial.hasClient()) {
        StaticJsonDocument<2048> jsonDoc;  // Adapter la taille selon le buffer
        JsonArray audioArray = jsonDoc.createNestedArray("audio_samples");

        for (int i = 0; i < bufferSize; i++) {
            audioArray.add(audioBuffer[i]); // Ajout des échantillons au JSON
        }

        jsonDoc["mode"] = "streaming";
        
        String payload;
        serializeJson(jsonDoc, payload);
        
        BTSerial.print(payload);  // Envoi via Bluetooth

        Serial.println("Données envoyées avec succès via Bluetooth!");
    }
}
