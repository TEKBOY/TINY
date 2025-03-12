import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRecordings, RecordingItem } from "../RecordingContext";
import * as FileSystem from 'expo-file-system';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { recordings, deleteRecording } = useRecordings();

  const saveTranscription = async (recording: RecordingItem) => {
    const fileUri = FileSystem.documentDirectory + `transcription_${recording.id}.txt`;
    try {
      await FileSystem.writeAsStringAsync(fileUri, recording.transcription, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert("Succès", `Transcription sauvegardée à :\n${fileUri}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      Alert.alert("Erreur", "La sauvegarde a échoué.");
    }
  };

  const renderItem = ({ item }: { item: RecordingItem }) => (
    <Pressable
      style={[styles.card, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}
      onPress={() => router.push(`/history/${item.id}`)}
    >
      <Text style={[styles.cardText, { color: isDark ? '#fff' : '#000' }]}>
        {item.title}
      </Text>
      <Text style={[styles.cardText, { color: isDark ? '#fff' : '#000' }]}>
        {item.transcription}
      </Text>
  
      <View style={styles.cardFooter}>
        <Text style={[styles.cardDate, { color: isDark ? '#888' : '#666' }]}>
          {new Date(item.date).toLocaleDateString()} • {item.duration}
        </Text>
        <View style={styles.cardActions}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="cloud-upload-outline" size={20} color="#007AFF" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => deleteRecording(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => saveTranscription(item)}>
            <Ionicons name="download-outline" size={20} color="#007AFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        Transcription History
      </Text>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  list: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});
