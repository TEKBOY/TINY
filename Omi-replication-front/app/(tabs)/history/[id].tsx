import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecordings } from '../RecordingContext';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function TranscriptionDetail() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { recordings } = useRecordings();
  const item = recordings.find((rec) => rec.id === id);

  const [activeTab, setActiveTab] = useState('original');

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>
          Transcription not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Transcription',
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.metadata}>
          <Text style={[styles.date, { color: isDark ? '#888' : '#666' }]}>
            {new Date(item.date).toLocaleString()}
          </Text>
          <Text style={[styles.duration, { color: isDark ? '#888' : '#666' }]}>
            Duration: {item.duration}
          </Text>
        </View>

        <View style={styles.actions}>
        </View>

        <View style={[styles.tabs, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <TabButton
            label="Original"
            isActive={activeTab === 'original'}
            onPress={() => setActiveTab('original')}
          />
          <TabButton
            label="Summary"
            isActive={activeTab === 'summary'}
            onPress={() => setActiveTab('summary')}
          />
          <TabButton
            label="Translation"
            isActive={activeTab === 'translation'}
            onPress={() => setActiveTab('translation')}
          />
        </View>

        <View style={[styles.transcriptionCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          {activeTab === 'original' && (
            <Text style={[styles.transcriptionText, { color: isDark ? '#fff' : '#000' }]}>
              {item.transcription}
            </Text>
          )}
          {activeTab === 'summary' && (
            <View style={styles.placeholder}>
              <Ionicons
                name="document-text-outline"
                size={32}
                color={isDark ? '#666' : '#999'}
              />
              <Text style={[styles.placeholderText, { color: isDark ? '#666' : '#999' }]}>
                Click the Summarize button to generate a summary
              </Text>
            </View>
          )}
          {activeTab === 'translation' && (
            <View style={styles.placeholder}>
              <Ionicons
                name="language-outline"
                size={32}
                color={isDark ? '#666' : '#999'}
              />
              <Text style={[styles.placeholderText, { color: isDark ? '#666' : '#999' }]}>
                Click the Translate button to see the translation
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function TabButton({ label, isActive, onPress }: TabButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Pressable
      style={[
        styles.tabButton,
        isActive && { backgroundColor: isDark ? '#333' : '#e5e5e5' },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabLabel,
          { color: isDark ? '#fff' : '#000' },
          isActive && { fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  metadata: {
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  transcriptionCard: {
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeholder: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
