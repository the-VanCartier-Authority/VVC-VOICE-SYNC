import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { useSpeech } from '@/hooks/use-speech';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const { speak, stop, isSpeaking, isLoading } = useSpeech();
  const [text, setText] = useState('');
  const [hasClipboard, setHasClipboard] = useState(false);

  useEffect(() => {
    checkClipboard();
  }, []);

  const checkClipboard = async () => {
    try {
      const hasText = await Clipboard.hasStringAsync();
      setHasClipboard(hasText);
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  };

  const handlePaste = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const clipboardText = await Clipboard.getStringAsync();
      setText(clipboardText);
      setHasClipboard(true);
    } catch (error) {
      console.error('Error pasting:', error);
    }
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setText('');
  };

  const handleSpeak = async () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    speak(text);
  };

  const handleStop = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    stop();
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00FFFF" />
        <Text className="mt-4 text-foreground">Inicializando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2 pt-4">
            <Text className="text-4xl font-bold text-primary">VVC</Text>
            <Text className="text-lg font-semibold text-foreground">VOICE SYNC</Text>
            <Text className="text-xs text-muted">Text-to-Speech Offline</Text>
          </View>

          {/* Text Input Area */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-primary uppercase tracking-wider">
              Ingresa tu texto
            </Text>
            <TextInput
              multiline
              numberOfLines={8}
              value={text}
              onChangeText={setText}
              placeholder="Pega o escribe el texto aquí..."
              placeholderTextColor="#7a8aaa"
              className={cn(
                'rounded-lg border-2 border-primary bg-surface p-4 text-base text-foreground',
                'font-mono'
              )}
              style={{
                textAlignVertical: 'top',
                borderColor: '#00FFFF',
                shadowColor: '#00FFFF',
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            />
            <Text className="text-xs text-muted">
              {text.length} caracteres
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <Pressable
                onPress={handlePaste}
                disabled={!hasClipboard}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: hasClipboard ? '#1a1f3a' : '#0a0e27',
                    borderWidth: 2,
                    borderColor: hasClipboard ? '#00FFFF' : '#7a8aaa',
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <Text className="text-center font-semibold text-primary">PEGAR</Text>
              </Pressable>

              <Pressable
                onPress={handleClear}
                disabled={!text.trim()}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: text.trim() ? '#1a1f3a' : '#0a0e27',
                    borderWidth: 2,
                    borderColor: text.trim() ? '#FF00FF' : '#7a8aaa',
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <Text className="text-center font-semibold text-accent">LIMPIAR</Text>
              </Pressable>
            </View>
          </View>

          {/* Main Control Button */}
          <Pressable
            onPress={isSpeaking ? handleStop : handleSpeak}
            disabled={!text.trim()}
            style={({ pressed }) => [
              {
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                backgroundColor: text.trim() ? '#00FFFF' : '#0a0e27',
                borderWidth: 2,
                borderColor: '#00FFFF',
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
                shadowColor: '#00FFFF',
                shadowOpacity: 0.5,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
          >
            <View className="flex-row items-center justify-center gap-3">
              {isSpeaking && <ActivityIndicator color="#0a0e27" size="small" />}
              <Text
                className={cn(
                  'text-center font-bold text-lg uppercase tracking-wider',
                  isSpeaking ? 'text-background' : 'text-background'
                )}
              >
                {isSpeaking ? 'DETENER' : 'REPRODUCIR'}
              </Text>
            </View>
          </Pressable>

          {/* Status Indicator */}
          {isSpeaking && (
            <View className="items-center gap-2 rounded-lg border-2 border-accent bg-surface p-4">
              <Text className="text-sm font-semibold text-accent">REPRODUCIENDO...</Text>
              <View className="flex-row gap-1">
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    className="h-2 w-1 rounded-full bg-accent"
                    style={{
                      opacity: 0.5 + (i * 0.2),
                    }}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Info */}
          <View className="items-center gap-2 rounded-lg bg-surface p-4 opacity-70">
            <Text className="text-xs text-muted">
              Funciona 100% sin conexión a internet
            </Text>
            <Text className="text-xs text-muted">
              Usa la voz nativa de tu dispositivo
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
