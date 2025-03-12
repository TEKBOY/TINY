#ifndef CONFIG_H
#define CONFIG_H

#define WIFI_SSID "Votre_SSID"
#define WIFI_PASSWORD "Votre_Mot_De_Passe"

#define SERVER_URL "http://votre_serveur.com/upload"  // URL de votre serveur pour l'upload via Wi-Fi

#define MIC_PIN 34 // Pin du micro analogique
#define BUTTON_PIN 12 // Bouton pour démarrer/arrêter l'enregistrement
#define LED_PIN 2 // LED pour indiquer l'enregistrement

#define SOUND_THRESHOLD 1000 // Ajuster selon le bruit ambiant
#define DEBOUNCE_DELAY 50 // Délai pour éviter les rebonds du bouton

// Bluetooth settings
#define BLUETOOTH_ENABLED true // Si vous souhaitez utiliser Bluetooth, mettez à true
#define BT_SERVER_NAME "OmiTranscriptionBT" // Nom du serveur Bluetooth
#define BT_SERVER_UUID "00001101-0000-1000-8000-00805F9B34FB" // UUID pour la communication Bluetooth SPP

#endif // CONFIG_H
