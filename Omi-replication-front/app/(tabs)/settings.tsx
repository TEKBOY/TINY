import { View, Text, StyleSheet, Switch, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';


type SettingItemProps = {
  title: string;
  value: boolean | string; 
  onValueChange?: (value: boolean) => void; 
  type?: 'switch' | 'button';
  icon: string;
  isDark?: boolean;
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [settings, setSettings] = useState({
    offlineMode: false,
    autoSync: true,
    darkMode: isDark,
    highQuality: true,
  });

  const SettingItem: React.FC<SettingItemProps> = ({
    title,
    value,
    onValueChange,
    type = 'switch',
    isDark = false,
  }) => (
    <View style={[styles.settingItem, { borderBottomColor: isDark ? '#333' : '#e5e5e5' }]}>
      <View style={styles.settingLeft}>
        <Text style={[styles.settingText, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={typeof value === 'boolean' ? value : false}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={typeof value === 'boolean' && value ? '#007AFF' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color={isDark ? '#666' : '#999'} />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Settings</Text>
      
      <View style={[styles.section, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
        <SettingItem
          title="Offline Mode"
          value={settings.offlineMode}
          onValueChange={(value) => setSettings(s => ({ ...s, offlineMode: value }))}
          icon="cloud-offline-outline"
        />
        <SettingItem
          title="Auto Sync"
          value={settings.autoSync}
          onValueChange={(value) => setSettings(s => ({ ...s, autoSync: value }))}
          icon="sync-outline"
        />
        <SettingItem
          title="High Quality Recording"
          value={settings.highQuality}
          onValueChange={(value) => setSettings(s => ({ ...s, highQuality: value }))}
          icon="mic-outline"
        />
      </View>

      <View style={[styles.section, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
        <Pressable>
          <SettingItem
            title="Language"
            value="English"
            type="button"
            icon="language-outline"
          />
        </Pressable>
        <Pressable>
          <SettingItem
            title="Voice Commands"
            value=""
            type="button"
            icon="list-outline"
          />
        </Pressable>
        <Pressable>
          <SettingItem
            title="Device Connection"
            value=""
            type="button"
            icon="bluetooth-outline"
          />
        </Pressable>
      </View>
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
  section: {
    marginTop: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
});