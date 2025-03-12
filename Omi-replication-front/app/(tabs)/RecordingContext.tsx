import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RecordingItem = {
  id: string;
  uri: string;
  transcription: string;
  date: string;
  duration: string;
  title: string;
};

type RecordingsContextType = {
  recordings: RecordingItem[];
  addRecording: (recording: RecordingItem) => void;
  deleteRecording: (id: string) => void;
};

const RecordingsContext = createContext<RecordingsContextType | undefined>(undefined);

export const RecordingsProvider = ({ children }: { children: ReactNode }) => {
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);

  const addRecording = (recording: RecordingItem) => {
    setRecordings((prev) => [recording, ...prev]);
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <RecordingsContext.Provider value={{ recordings, addRecording, deleteRecording }}>
      {children}
    </RecordingsContext.Provider>
  );
};

export const useRecordings = () => {
  const context = useContext(RecordingsContext);
  if (!context) {
    throw new Error('useRecordings must be used within a RecordingsProvider');
  }
  return context;
};