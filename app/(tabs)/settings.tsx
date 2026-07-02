import { ScrollView, Text, View, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useSpeech } from '@/hooks/use-speech';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { settings, updateSettings, availableVoices, isLoading } = useSpeech();

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
    <ScreenContainer className="bg-background p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="items-center gap-2 pt-4">
            <Text className="text-3xl font-bold text-primary">CONFIGURACIÓN</Text>
            <Text className="text-xs text-muted">Ajusta tu experiencia de voz</Text>
          </View>

          {/* Idioma/Voz */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-primary uppercase tracking-wider">
              Idioma / Voz
            </Text>
            <View className="rounded-lg border-2 border-primary bg-surface p-4">
              <Picker
                selectedValue={settings.language}
                onValueChange={handleLanguageChange}
                style={{
                  color: '#E0FFFF',
                }}
              >
                {availableVoices.map((voice) => (
                  <Picker.Item
                    key={voice.identifier}
                    label={`${voice.name} (${voice.language})`}
                    value={voice.language}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Velocidad */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-primary uppercase tracking-wider">
                Velocidad
              </Text>
              <Text className="text-sm font-mono text-accent">{settings.rate.toFixed(1)}x</Text>
            </View>
            <View className="rounded-lg bg-surface p-4">
              <Slider
                style={{ height: 40 }}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.1}
                value={settings.rate}
                onValueChange={handleRateChange}
                minimumTrackTintColor="#00FFFF"
                maximumTrackTintColor="#7a8aaa"
                thumbTintColor="#FF00FF"
              />
              <View className="mt-2 flex-row justify-between">
                <Text className="text-xs text-muted">0.5x</Text>
                <Text className="text-xs text-muted">2.0x</Text>
              </View>
            </View>
          </View>

          {/* Tono */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-primary uppercase tracking-wider">
                Tono
              </Text>
              <Text className="text-sm font-mono text-accent">{settings.pitch.toFixed(1)}</Text>
            </View>
            <View className="rounded-lg bg-surface p-4">
              <Slider
                style={{ height: 40 }}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.1}
                value={settings.pitch}
                onValueChange={handlePitchChange}
                minimumTrackTintColor="#00FFFF"
                maximumTrackTintColor="#7a8aaa"
                thumbTintColor="#FF00FF"
              />
              <View className="mt-2 flex-row justify-between">
                <Text className="text-xs text-muted">Grave</Text>
                <Text className="text-xs text-muted">Agudo</Text>
              </View>
            </View>
          </View>

          {/* Volumen */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-primary uppercase tracking-wider">
                Volumen
              </Text>
              <Text className="text-sm font-mono text-accent">{Math.round(settings.volume * 100)}%</Text>
            </View>
            <View className="rounded-lg bg-surface p-4">
              <Slider
                style={{ height: 40 }}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={settings.volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#00FFFF"
                maximumTrackTintColor="#7a8aaa"
                thumbTintColor="#FF00FF"
              />
              <View className="mt-2 flex-row justify-between">
                <Text className="text-xs text-muted">Silencio</Text>
                <Text className="text-xs text-muted">Máximo</Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View className="gap-2 rounded-lg border-2 border-accent bg-surface p-4">
            <Text className="text-xs font-semibold text-accent uppercase">INFORMACIÓN</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Los cambios se guardan automáticamente. Todos los ajustes se aplican en tiempo real.
            </Text>
            <Text className="mt-2 text-xs text-muted leading-relaxed">
              Funciona 100% sin conexión. No requiere permisos especiales.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
