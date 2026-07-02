import { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  language: string;
  voiceId?: string;
}

const DEFAULT_SETTINGS: SpeechSettings = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  language: 'es-ES',
};

const STORAGE_KEY = 'speech_settings';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettings] = useState<SpeechSettings>(DEFAULT_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración guardada y voces disponibles
  useEffect(() => {
    const initialize = async () => {
      try {
        // Cargar configuración guardada
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

        // Cargar voces disponibles
        const voices = await Speech.getAvailableVoicesAsync();
        setAvailableVoices(voices);

        // Si no hay idioma guardado, usar el primero disponible
        if (!savedSettings && voices.length > 0) {
          const defaultVoice = voices.find((v) => v.language.startsWith('es')) || voices[0];
          setSettings((prev) => ({
            ...prev,
            language: defaultVoice.language,
            voiceId: defaultVoice.identifier,
          }));
        }
      } catch (error) {
        console.error('Error initializing speech:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Guardar configuración cuando cambia
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };

    if (!isLoading) {
      saveSettings();
    }
  }, [settings, isLoading]);

  const speak = async (text: string) => {
    try {
      // Verificar si ya está hablando
      const currentlySpeaking = await Speech.isSpeakingAsync();
      if (currentlySpeaking) {
        return;
      }

      setIsSpeaking(true);

      Speech.speak(text, {
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume,
        language: settings.language,
        voice: settings.voiceId,
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error('Error speaking:', error);
      setIsSpeaking(false);
    }
  };

  const stop = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const pause = async () => {
    try {
      await Speech.pause();
    } catch (error) {
      console.error('Error pausing speech:', error);
    }
  };

  const resume = async () => {
    try {
      await Speech.resume();
    } catch (error) {
      console.error('Error resuming speech:', error);
    }
  };

  const updateSettings = (newSettings: Partial<SpeechSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    settings,
    updateSettings,
    availableVoices,
    isLoading,
  };
}
