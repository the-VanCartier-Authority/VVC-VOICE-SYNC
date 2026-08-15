import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSpeechRecognitionAvailability,
  prepareSpeechRecognition,
  requestSpeechPermissionsAsync,
  streamTranscription,
  type SpeechRecognitionAvailability,
} from 'expo-ai-kit';

const DEFAULT_LOCALE = 'es-ES';

type DictationStatus = 'idle' | 'preparing' | 'listening' | 'unavailable' | 'error';

type UseDictationResult = {
  availability: SpeechRecognitionAvailability | null;
  status: DictationStatus;
  isListening: boolean;
  isPreparing: boolean;
  transcript: string;
  errorMessage: string | null;
  startDictation: () => Promise<boolean>;
  stopDictation: () => void;
  clearTranscript: () => void;
};

export function useDictation(locale = DEFAULT_LOCALE): UseDictationResult {
  const [availability, setAvailability] = useState<SpeechRecognitionAvailability | null>(null);
  const [status, setStatus] = useState<DictationStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const streamRef = useRef<ReturnType<typeof streamTranscription> | null>(null);
  const requestIdRef = useRef(0);

  const stopDictation = useCallback(() => {
    requestIdRef.current += 1;
    streamRef.current?.stop();
    streamRef.current = null;
    setStatus((currentStatus) => (currentStatus === 'unavailable' ? currentStatus : 'idle'));
  }, []);

  const checkAvailability = useCallback(async () => {
    try {
      const nextAvailability = await getSpeechRecognitionAvailability({ locale });
      setAvailability(nextAvailability);
      return nextAvailability;
    } catch (error) {
      console.error('Error checking speech recognition availability:', error);
      setErrorMessage('No se pudo comprobar la disponibilidad del dictado local.');
      setStatus('error');
      return null;
    }
  }, [locale]);

  useEffect(() => {
    void checkAvailability();
    return () => {
      requestIdRef.current += 1;
      streamRef.current?.stop();
    };
  }, [checkAvailability]);

  const startDictation = useCallback(async () => {
    if (status === 'listening' || status === 'preparing') return false;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setErrorMessage(null);
    setTranscript('');
    setStatus('preparing');

    try {
      const nextAvailability = await getSpeechRecognitionAvailability({ locale });
      setAvailability(nextAvailability);

      if (nextAvailability.status === 'unavailable') {
        setStatus('unavailable');
        setErrorMessage(
          nextAvailability.reason === 'not-enabled'
            ? 'El dictado local no está habilitado en la compilación actual.'
            : `El dispositivo no admite dictado local para ${locale}.`,
        );
        return false;
      }

      if (nextAvailability.status !== 'available') {
        await prepareSpeechRecognition({ locale });
      }

      if (requestIdRef.current !== requestId) return false;

      const permission = await requestSpeechPermissionsAsync();
      if (!permission.granted) {
        setStatus('error');
        setErrorMessage(
          permission.canAskAgain
            ? 'Se necesita permiso de micrófono para iniciar el dictado.'
            : 'El permiso de micrófono fue denegado en la configuración del dispositivo.',
        );
        return false;
      }

      const handle = streamTranscription(
        (update) => {
          if (requestIdRef.current === requestId) {
            setTranscript(update.text);
          }
        },
        { locale },
      );

      streamRef.current = handle;
      setStatus('listening');

      void handle.promise
        .then((result) => {
          if (requestIdRef.current === requestId) {
            setTranscript(result.text);
            setStatus('idle');
            streamRef.current = null;
          }
        })
        .catch((error) => {
          if (requestIdRef.current === requestId) {
            console.error('Speech recognition error:', error);
            setStatus('error');
            setErrorMessage('El motor de dictado local reportó un error.');
            streamRef.current = null;
          }
        });

      return true;
    } catch (error) {
      if (requestIdRef.current === requestId) {
        console.error('Error starting speech recognition:', error);
        setStatus('error');
        setErrorMessage('No se pudo iniciar el dictado local en este dispositivo.');
      }
      return false;
    }
  }, [locale, status]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setErrorMessage(null);
    if (status === 'error' || status === 'unavailable') setStatus('idle');
  }, [status]);

  return {
    availability,
    status,
    isListening: status === 'listening',
    isPreparing: status === 'preparing',
    transcript,
    errorMessage,
    startDictation,
    stopDictation,
    clearTranscript,
  };
}
