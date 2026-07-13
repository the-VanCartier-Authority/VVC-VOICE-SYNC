import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import type { SpeechSettings } from '@/shared/types';

const DEFAULT_SETTINGS: SpeechSettings = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  language: 'es-ES',
};

const STORAGE_KEY = 'speech_settings';
const MAX_UTTERANCE_LENGTH = 3500;

interface SpeechContextValue {
  speak: (text: string) => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  isSpeaking: boolean;
  settings: SpeechSettings;
  updateSettings: (newSettings: Partial<SpeechSettings>) => void;
  availableVoices: Speech.Voice[];
  isLoading: boolean;
  errorMessage: string | null;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

function splitTextForSpeech(text: string): string[] {
  const normalizedText = text.replace(/\s+/g, ' ').trim();

  if (!normalizedText) {
    return [];
  }

  const sentences = normalizedText.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g) ?? [normalizedText];
  const chunks: string[] = [];
  let currentChunk = '';

  sentences.forEach((sentence) => {
    const cleanSentence = sentence.trim();
    if (!cleanSentence) return;

    if (cleanSentence.length > MAX_UTTERANCE_LENGTH) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      for (let index = 0; index < cleanSentence.length; index += MAX_UTTERANCE_LENGTH) {
        chunks.push(cleanSentence.slice(index, index + MAX_UTTERANCE_LENGTH).trim());
      }
      return;
    }

    const candidate = `${currentChunk} ${cleanSentence}`.trim();
    if (candidate.length > MAX_UTTERANCE_LENGTH) {
      chunks.push(currentChunk.trim());
      currentChunk = cleanSentence;
      return;
    }

    currentChunk = candidate;
  });

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function SpeechProvider({ children }: PropsWithChildren) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettings] = useState<SpeechSettings>(DEFAULT_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const settingsRef = useRef(settings);
  const queueIdRef = useRef(0);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const [savedSettings, voices] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          Speech.getAvailableVoicesAsync(),
        ]);

        setAvailableVoices(voices);

        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings) as SpeechSettings;
          setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
          return;
        }

        const defaultVoice = voices.find((voice) => voice.language.startsWith('es')) ?? voices[0];
        if (defaultVoice) {
          setSettings({
            ...DEFAULT_SETTINGS,
            language: defaultVoice.language,
            voiceId: defaultVoice.identifier,
          });
        }
      } catch (error) {
        console.error('Error initializing speech:', error);
        setErrorMessage('No se pudo inicializar el motor de voz del dispositivo.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      queueIdRef.current += 1;
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
        setErrorMessage('No se pudo guardar la configuración de voz.');
      }
    };

    if (!isLoading) {
      saveSettings();
    }
  }, [settings, isLoading]);

  const speakChunk = useCallback((chunk: string, queueId: number) => {
    const currentSettings = settingsRef.current;

    return new Promise<void>((resolve) => {
      Speech.speak(chunk, {
        rate: currentSettings.rate,
        pitch: currentSettings.pitch,
        volume: currentSettings.volume,
        language: currentSettings.language,
        voice: currentSettings.voiceId,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: (error) => {
          if (queueIdRef.current === queueId) {
            console.error('Speech error:', error);
            setErrorMessage('El motor TTS reportó un error durante la reproducción.');
          }
          resolve();
        },
      });
    });
  }, []);

  const speak = useCallback(
    async (text: string) => {
      const chunks = splitTextForSpeech(text);
      if (chunks.length === 0) return;

      const queueId = queueIdRef.current + 1;
      queueIdRef.current = queueId;
      setErrorMessage(null);
      setIsSpeaking(true);

      try {
        await Speech.stop();

        for (const chunk of chunks) {
          if (queueIdRef.current !== queueId) break;
          await speakChunk(chunk, queueId);
        }
      } catch (error) {
        console.error('Error speaking:', error);
        setErrorMessage('No se pudo reproducir el texto. Verifica las voces del dispositivo.');
      } finally {
        if (queueIdRef.current === queueId) {
          setIsSpeaking(false);
        }
      }
    },
    [speakChunk],
  );

  const stop = useCallback(async () => {
    try {
      queueIdRef.current += 1;
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
      setErrorMessage('No se pudo detener la reproducción.');
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      await Speech.pause();
    } catch (error) {
      console.error('Error pausing speech:', error);
      setErrorMessage('El dispositivo no pudo pausar la reproducción.');
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      await Speech.resume();
    } catch (error) {
      console.error('Error resuming speech:', error);
      setErrorMessage('El dispositivo no pudo reanudar la reproducción.');
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SpeechSettings>) => {
    setSettings((previousSettings) => ({ ...previousSettings, ...newSettings }));
  }, []);

  const value = useMemo(
    () => ({
      speak,
      stop,
      pause,
      resume,
      isSpeaking,
      settings,
      updateSettings,
      availableVoices,
      isLoading,
      errorMessage,
    }),
    [
      speak,
      stop,
      pause,
      resume,
      isSpeaking,
      settings,
      updateSettings,
      availableVoices,
      isLoading,
      errorMessage,
    ],
  );

  return React.createElement(SpeechContext.Provider, { value }, children);
}

export function useSpeech() {
  const context = useContext(SpeechContext);

  if (!context) {
    throw new Error('useSpeech must be used within SpeechProvider');
  }

  return context;
}
