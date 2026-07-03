import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator, Image } from 'react-native';
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
      <ScreenContainer className="flex-1 items-center justify-center bg-[#05070A]">
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text className="mt-4 text-[#E6FBFF] font-mono">INITIALIZING_VVC_CORE...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-[#05070A] p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header with Logo */}
          <View className="items-center gap-4 pt-6">
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={{ width: 300, height: 120, resizeMode: 'contain' }}
            />
            <View className="h-[1px] w-full bg-[#00E5FF] opacity-30" />
            <Text className="text-xs font-mono text-[#00E5FF] tracking-[4px] uppercase">
              Voice Synchronization System
            </Text>
          </View>

          {/* Text Input Area */}
          <View className="gap-3">
            <View className="flex-row justify-between items-end">
              <Text className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest">
                {'>'} Input_Buffer
              </Text>
              <Text className="text-[10px] font-mono text-[#8FDCE8]">
                {text.length} BYTES
              </Text>
            </View>
            
            <View className="relative">
              <TextInput
                multiline
                numberOfLines={8}
                value={text}
                onChangeText={setText}
                placeholder="READY_FOR_INPUT..."
                placeholderTextColor="#1a3a4a"
                className={cn(
                  'rounded-sm border border-[#00E5FF] bg-[#101820] p-4 text-base text-[#E6FBFF]',
                  'font-mono'
                )}
                style={{
                  textAlignVertical: 'top',
                  minHeight: 200,
                }}
              />
              <View className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00E5FF]" />
              <View className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00E5FF]" />
              <View className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00E5FF]" />
              <View className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00E5FF]" />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handlePaste}
              disabled={!hasClipboard}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: hasClipboard ? '#101820' : '#05070A',
                  borderWidth: 1,
                  borderColor: hasClipboard ? '#00E5FF' : '#1a3a4a',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-center font-mono text-[12px] text-[#00E5FF]">PASTE_DATA</Text>
            </Pressable>

            <Pressable
              onPress={handleClear}
              disabled={!text.trim()}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: text.trim() ? '#101820' : '#05070A',
                  borderWidth: 1,
                  borderColor: text.trim() ? '#FF2A4F' : '#1a3a4a',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-center font-mono text-[12px] text-[#FF2A4F]">WIPE_BUFFER</Text>
            </Pressable>
          </View>

          {/* Main Control Button */}
          <Pressable
            onPress={isSpeaking ? handleStop : handleSpeak}
            disabled={!text.trim()}
            style={({ pressed }) => [
              {
                paddingVertical: 16,
                backgroundColor: text.trim() ? (isSpeaking ? '#FF2A4F' : '#00E5FF') : '#101820',
                borderWidth: 1,
                borderColor: text.trim() ? (isSpeaking ? '#FF2A4F' : '#00E5FF') : '#1a3a4a',
                opacity: pressed ? 0.8 : 1,
                shadowColor: isSpeaking ? '#FF2A4F' : '#00E5FF',
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 10,
              },
            ]}
          >
            <View className="flex-row items-center justify-center gap-3">
              {isSpeaking && <ActivityIndicator color="#05070A" size="small" />}
              <Text className="text-center font-mono font-bold text-lg text-[#05070A] tracking-widest">
                {isSpeaking ? 'ABORT_SYNC' : 'EXECUTE_SYNC'}
              </Text>
            </View>
          </Pressable>

          {/* Status Indicator */}
          {isSpeaking && (
            <View className="items-center gap-3 border border-[#FF2A4F] bg-[#101820] p-4">
              <Text className="text-[10px] font-mono text-[#FF2A4F]">
                {'>'} SYNCING_VOICE_STREAM...
              </Text>
            </View>
          )}

          {/* Footer Info */}
          <View className="mt-auto pt-8 items-center">
            <Text className="text-[8px] font-mono text-[#8FDCE8] opacity-50">
              VVC_AUTHORITY // SECURE_OFFLINE_MODE // ENCRYPTED_TTS
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
