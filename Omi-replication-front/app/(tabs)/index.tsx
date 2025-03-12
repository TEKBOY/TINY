import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import { useRecordings } from './RecordingContext';

// Fonction pour formater la durée en mm:ss
const formatDuration = (millis: number): string => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getTitleFromBackend = async (transcription: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3000/deepgram/generate-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcription }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || response.statusText);
    }
    return data.title;
  } catch (error) {
    console.error("Erreur lors de la récupération du titre :", error);
    throw error;
  }
};

const getTranscriptionFromBackend = async (audioUrl: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3000/deepgram/transcribe", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioUrl }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || response.statusText);
    }
    return data.transcription;
  } catch (error) {
    console.error("Erreur lors de la transcription :", error);
    throw error;
  }
};

const uploadAudioFile = async (fileUri: string) => {
  const blob = await fetch(fileUri).then(res => res.blob());
  const file = new File([blob], "recording.m4a", { type: blob.type });
  
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch('http://localhost:3000/deepgram/upload', {
    method: 'POST',
    body: formData,
  });
  return await response.json();
};

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const { addRecording } = useRecordings();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isRecording
            ? withRepeat(withSequence(withSpring(1.2), withSpring(1)), -1, true)
            : withSpring(1),
        },
      ],
    };
  });

  const toggleRecording = useCallback(async () => {
    if (!recording) {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
          console.error("Permission refusée pour l'enregistrement");
          return;
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await recordingInstance.startAsync();
        setRecording(recordingInstance);
        setRecordingStartTime(Date.now());
        setIsRecording(true);
        setTranscribedText('Enregistrement en cours...');
      } catch (error) {
        console.error('Erreur au démarrage de l’enregistrement', error);
      }
    } else {
      try {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const fileUri = recording.getURI();
        if (!fileUri) {
          console.error("URI non disponible");
          return;
        }
        const stopTime = Date.now();
        const durationMillis = recordingStartTime ? stopTime - recordingStartTime : 0;
        const durationStr = formatDuration(durationMillis);

        const uploadResponse = await uploadAudioFile(fileUri);
        const transcription = uploadResponse.transcription ?? 'Aucune transcription';
        const title = await getTitleFromBackend(transcription);
        
        addRecording({
          id: Date.now().toString(),
          uri: fileUri,
          transcription,
          title,
          date: new Date().toISOString(),
          duration: durationStr,
        });
        console.log('Enregistrement stocké à :', fileUri, 'Durée:', durationStr);
        setTranscribedText(transcription);
        setRecording(null);
        setRecordingStartTime(null);
      } catch (error) {
        console.error('Erreur à l’arrêt de l’enregistrement', error);
      }
    }
  }, [recording, recordingStartTime]);
  

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.transcriptionContainer}>
        <Text style={[styles.transcriptionText, { color: isDark ? '#fff' : '#000' }]}>
          {transcribedText || 'Appuyez sur le micro pour enregistrer'}
        </Text>
      </View>
      
      <Animated.View style={[styles.recordButtonContainer, animatedStyle]}>
        <Pressable
          onPress={toggleRecording}
          style={({ pressed }) => [
            styles.recordButton,
            { backgroundColor: isRecording ? '#FF3B30' : '#007AFF', opacity: pressed ? 0.8 : 1 },
          ]}>
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={32} color="#fff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  transcriptionContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 60,
  },
  transcriptionText: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  recordButtonContainer: {
    marginBottom: 50,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
