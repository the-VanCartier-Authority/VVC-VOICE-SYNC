import { ScrollView, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useSpeech } from '@/hooks/use-speech';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { settings, updateSettings, availableVoices } = useSpeech();

  const handleRateChange = (value: number) => {
    updateSettings({ rate: value });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePitchChange = (value: number) => {
    updateSettings({ pitch: value });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVolumeChange = (value: number) => {
    updateSettings({ volume: value });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenContainer className="bg-[#0A0B0D] p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="items-center gap-2 pt-4">
            <Text className="text-3xl font-mono font-bold text-[#00FF66]">CORE_CONFIG</Text>
            <Text className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-widest">Voice Synchronization Parameters</Text>
          </View>

          <View className="h-[1px] w-full bg-[#9CA3AF] opacity-20" />

          {/* Idioma/Voz */}
          <View className="gap-3">
            <Text className="text-[10px] font-mono text-[#00FF66] uppercase tracking-widest">
              {'>'} Voice_Profile
            </Text>
            <View className="border border-[#9CA3AF] bg-[#0A0B0D] p-1">
              <Picker
                selectedValue={settings.language}
                onValueChange={handleLanguageChange}
                style={{
                  color: '#E5E7EB',
                  backgroundColor: '#0A0B0D',
                }}
                dropdownIconColor="#00FF66"
              >
                {availableVoices.map((voice) => (
                  <Picker.Item
                    key={voice.identifier}
                    label={`${voice.name} (${voice.language})`}
                    value={voice.language}
                    color="#E5E7EB"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Velocidad */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-mono text-[#00FF66] uppercase tracking-widest">
                {'>'} Processing_Rate
              </Text>
              <Text className="text-sm font-mono text-[#D4AF37]">{settings.rate.toFixed(1)}x</Text>
            </View>
            <View className="border border-[#9CA3AF] bg-[#0A0B0D] p-4">
              <Slider
                style={{ height: 40 }}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.1}
                value={settings.rate}
                onValueChange={handleRateChange}
                minimumTrackTintColor="#00FF66"
                maximumTrackTintColor="#2D3748"
                thumbTintColor="#D4AF37"
              />
              <View className="mt-2 flex-row justify-between">
                <Text className="text-[8px] font-mono text-[#9CA3AF]">0.5x</Text>
                <Text className="text-[8px] font-mono text-[#9CA3AF]">2.0x</Text>
              </View>
            </View>
          </View>

          {/* Tono */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-mono text-[#00FF66] uppercase tracking-widest">
                {'>'} Frequency_Pitch
              </Text>
              <Text className="text-sm font-mono text-[#D4AF37]">{settings.pitch.toFixed(1)}</Text>
            </View>
            <View className="border border-[#9CA3AF] bg-[#0A0B0D] p-4">
              <Slider
                style={{ height: 40 }}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.1}
                value={settings.pitch}
                onValueChange={handlePitchChange}
                minimumTrackTintColor="#00FF66"
                maximumTrackTintColor="#2D3748"
                thumbTintColor="#D4AF37"
              />
              <View className="mt-2 flex-row justify-between">
                <Text className="text-[8px] font-mono text-[#9CA3AF]">LOW_FREQ</Text>
                <Text className="text-[8px] font-mono text-[#9CA3AF]">HIGH_FREQ</Text>
              </View>
            </View>
          </View>

          {/* Volumen */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-mono text-[#00FF66] uppercase tracking-widest">
                {'>'} Output_Amplitude
              </Text>
              <Text className="text-sm font-mono text-[#D4AF37]">{Math.round(settings.volume * 100)}%</Text>
            </View>
            <View className="border border-[#9CA3AF] bg-[#0A0B0D] p-4">
              <Slider
                style={{ height: 40 }}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={settings.volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#00FF66"
                maximumTrackTintColor="#2D3748"
                thumbTintColor="#D4AF37"
              />
              <View className="mt-2 flex-row justify-between">
                <Text className="text-[8px] font-mono text-[#9CA3AF]">SILENCE</Text>
                <Text className="text-[8px] font-mono text-[#9CA3AF]">MAX_GAIN</Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View className="gap-2 border border-[#D4AF37] bg-[#0A0B0D] p-4">
            <Text className="text-[10px] font-mono font-semibold text-[#D4AF37] uppercase tracking-widest">SYSTEM_STATUS</Text>
            <Text className="text-[9px] font-mono text-[#9CA3AF] leading-relaxed">
              Auto-save enabled. All parameters applied to the real-time synthesis engine.
            </Text>
            <Text className="mt-2 text-[9px] font-mono text-[#9CA3AF] leading-relaxed">
              100% Offline operation. Zero telemetry. Secure execution.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
