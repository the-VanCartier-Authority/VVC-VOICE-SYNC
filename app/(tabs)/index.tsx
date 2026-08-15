import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { useSpeech } from '@/hooks/use-speech';
import { useDictation } from '@/hooks/use-dictation';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const { speak, stop, isSpeaking, isLoading, errorMessage } = useSpeech();
  const {
    isListening: isDictating,
    isPreparing: isPreparingDictation,
    transcript: dictationTranscript,
    errorMessage: dictationErrorMessage,
    startDictation,
    stopDictation,
    clearTranscript,
  } = useDictation();
  const [text, setText] = useState('');
  const [hasClipboard, setHasClipboard] = useState(false);
  const dictationBaseTextRef = useRef('');

  useEffect(() => {
    checkClipboard();
  }, []);

  useEffect(() => {
    if (!dictationTranscript) return;

    const baseText = dictationBaseTextRef.current.trim();
    setText(baseText ? `${baseText}\n${dictationTranscript}` : dictationTranscript);
  }, [dictationTranscript]);

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
    dictationBaseTextRef.current = '';
    clearTranscript();
  };

  const handleDictation = async () => {
    Haptics.impactAsync(
      isDictating ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
    );

    if (isDictating) {
      stopDictation();
      return;
    }

    dictationBaseTextRef.current = text;
    await startDictation();
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
      <ScreenContainer className="flex-1 items-center justify-center bg-[#0A0B0D]">
        <ActivityIndicator size="large" color="#00FF66" />
        <Text className="mt-4 text-[#E5E7EB] font-mono">INITIALIZING_VVC_CORE...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-[#0A0B0D] p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Banner de la aplicación */}
        <Image 
          source={require('@/assets/images/banner_readme.png')} 
          style={{ width: '100%', height: 120, resizeMode: 'cover' }}
        />
        
        <View className="flex-1 gap-6 p-4">
          {/* Header with Logo Interfaz */}
          <View className="flex-row items-center justify-between pt-2">
            <Image 
              source={require('@/assets/images/logo_interfaz.png')} 
              style={{ width: 150, height: 40, resizeMode: 'contain' }}
            />
            <Text className="text-[10px] font-mono text-[#D4AF37] tracking-[2px] uppercase">
              VVC-TRINCHERA
            </Text>
          </View>

          <View className="h-[1px] w-full bg-[#9CA3AF] opacity-20" />

          {/* Text Input Area */}
          <View className="gap-3">
            <View className="flex-row justify-between items-end">
              <Text className="text-[10px] font-mono text-[#00FF66] uppercase tracking-widest">
                {'>'} Input_Buffer
              </Text>
              <Text className="text-[10px] font-mono text-[#9CA3AF]">
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
                placeholderTextColor="#2D3748"
                className={cn(
                  'border border-[#9CA3AF] bg-[#0A0B0D] p-4 text-base text-[#E5E7EB]',
                  'font-mono'
                )}
                style={{
                  textAlignVertical: 'top',
                  minHeight: 200,
                  borderRadius: 0, // Ángulos rectos estrictos
                }}
              />
              {/* Corner accents */}
              <View className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FF66]" />
              <View className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00FF66]" />
              <View className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00FF66]" />
              <View className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00FF66]" />
            </View>
          </View>

          {/* Local dictation control */}
          <Pressable
            onPress={handleDictation}
            disabled={isPreparingDictation}
            style={({ pressed }) => [
              {
                paddingVertical: 14,
                backgroundColor: isDictating ? '#D4AF37' : '#0A0B0D',
                borderWidth: 1,
                borderColor: isDictating ? '#D4AF37' : '#00FF66',
                opacity: pressed ? 0.8 : isPreparingDictation ? 0.5 : 1,
                borderRadius: 0,
              },
            ]}
          >
            <View className="flex-row items-center justify-center gap-3">
              {isPreparingDictation && <ActivityIndicator color="#00FF66" size="small" />}
              <Text
                className={cn(
                  'text-center font-mono font-bold text-[12px] tracking-widest',
                  isDictating ? 'text-[#0A0B0D]' : 'text-[#00FF66]',
                )}
              >
                {isPreparingDictation
                  ? 'PREPARING_LOCAL_MODEL...'
                  : isDictating
                    ? 'STOP_LOCAL_DICTATION'
                    : 'START_LOCAL_DICTATION'}
              </Text>
            </View>
          </Pressable>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handlePaste}
              disabled={!hasClipboard}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#0A0B0D',
                  borderWidth: 1,
                  borderColor: hasClipboard ? '#00FF66' : '#2D3748',
                  opacity: pressed ? 0.7 : 1,
                  borderRadius: 0,
                },
              ]}
            >
              <Text className={cn(
                "text-center font-mono text-[12px]",
                hasClipboard ? "text-[#00FF66]" : "text-[#2D3748]"
              )}>PASTE_DATA</Text>
            </Pressable>

            <Pressable
              onPress={handleClear}
              disabled={!text.trim()}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#0A0B0D',
                  borderWidth: 1,
                  borderColor: text.trim() ? '#D4AF37' : '#2D3748',
                  opacity: pressed ? 0.7 : 1,
                  borderRadius: 0,
                },
              ]}
            >
              <Text className={cn(
                "text-center font-mono text-[12px]",
                text.trim() ? "text-[#D4AF37]" : "text-[#2D3748]"
              )}>WIPE_BUFFER</Text>
            </Pressable>
          </View>

          {/* Main Control Button */}
          <Pressable
            onPress={isSpeaking ? handleStop : handleSpeak}
            disabled={!text.trim()}
            style={({ pressed }) => [
              {
                paddingVertical: 16,
                backgroundColor: text.trim() ? (isSpeaking ? '#D4AF37' : '#00FF66') : '#0A0B0D',
                borderWidth: 1,
                borderColor: text.trim() ? (isSpeaking ? '#D4AF37' : '#00FF66') : '#2D3748',
                opacity: pressed ? 0.8 : 1,
                borderRadius: 0,
              },
            ]}
          >
            <View className="flex-row items-center justify-center gap-3">
              {isSpeaking && <ActivityIndicator color="#0A0B0D" size="small" />}
              <Text className="text-center font-mono font-bold text-lg text-[#0A0B0D] tracking-widest">
                {isSpeaking ? 'ABORT_SYNC' : 'EXECUTE_SYNC'}
              </Text>
            </View>
          </Pressable>

          {(errorMessage || dictationErrorMessage) && (
            <View className="items-center gap-2 border border-[#D4AF37] bg-[#0A0B0D] p-4">
              <Text className="text-[10px] font-mono text-[#D4AF37]">
                {'>'} {dictationErrorMessage ? 'STT_ALERT' : 'TTS_ALERT'}
              </Text>
              <Text className="text-[10px] font-mono text-[#E5E7EB] text-center">
                {dictationErrorMessage || errorMessage}
              </Text>
            </View>
          )}

          {/* Status Indicator */}
          {(isSpeaking || isDictating) && (

            <View className="items-center gap-3 border border-[#D4AF37] bg-[#0A0B0D] p-4">
              <Text className="text-[10px] font-mono text-[#D4AF37]">
                {'>'} {isDictating ? 'LISTENING_LOCAL_MIC...' : 'SYNCING_VOICE_STREAM...'}
              </Text>
            </View>
          )}

          {/* Footer Info */}
          <View className="mt-auto pt-8 items-center">
            <Text className="text-[8px] font-mono text-[#9CA3AF] opacity-50">
              VVC_AUTHORITY // SECURE_OFFLINE_MODE // ENCRYPTED_TTS
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
