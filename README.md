# VVC Voice Sync

Aplicación móvil de **texto a voz (TTS) offline** para Android e iOS. VVC Voice Sync utiliza las voces disponibles en el dispositivo mediante `expo-speech`, por lo que la lectura no requiere una API de voz externa.

## Características

- Texto a voz usando el motor TTS nativo del dispositivo.
- Funcionamiento offline para la conversión de texto a voz.
- Pegado de texto desde el portapapeles.
- Reproducción y detención de lectura.
- Selección entre las voces disponibles en el dispositivo.
- Ajuste de velocidad, tono y volumen.
- Persistencia local de la configuración.
- Interfaz optimizada para uso móvil.

## Requisitos

- Node.js compatible con Expo SDK 54.
- pnpm 9.15.4.
- Para Android: Android SDK y un dispositivo/emulador configurado.
- Para iOS: macOS con Xcode y un dispositivo/simulador configurado.

## Desarrollo

Instala las dependencias:

```bash
pnpm install
```

Para comprobar TypeScript:

```bash
pnpm check
```

Para ejecutar las pruebas:

```bash
pnpm test
```

Para Android:

```bash
pnpm android
```

Para iOS:

```bash
pnpm ios
```

> El flujo principal de VVC Voice Sync no necesita un servidor backend para convertir texto a voz. La disponibilidad y calidad de las voces dependen del motor TTS instalado y configurado en el dispositivo.

## Compilación Android

El repositorio incluye un workflow de GitHub Actions que genera un APK Release mediante Gradle.

El artefacto debe probarse en un dispositivo Android físico antes de considerar una compilación como validación de funcionamiento. Un build exitoso únicamente demuestra que el proyecto compiló correctamente.

## Arquitectura

El flujo principal es:

```text
Texto
  ↓
SpeechProvider
  ↓
expo-speech
  ↓
Motor TTS del dispositivo
  ↓
Audio
```

La configuración de voz se guarda localmente mediante AsyncStorage.

## Limitaciones conocidas

- La lista de voces depende de las voces instaladas en el dispositivo.
- Un dispositivo sin una voz española instalada puede no ofrecer una voz `es-ES`.
- El soporte de pausado/reanudación y ciertos comportamientos del motor pueden variar entre plataformas y motores TTS.
- La validación en dispositivo físico es necesaria para confirmar el comportamiento de un APK Release.

## Estructura principal

- `app/(tabs)/index.tsx`: pantalla principal.
- `app/(tabs)/settings.tsx`: configuración de voz.
- `hooks/use-speech.ts`: núcleo de TTS y persistencia de configuración.
- `app/_layout.tsx`: composición raíz de la aplicación.
- `app.config.ts`: configuración Expo/Android/iOS.
- `.github/workflows/android-build.yml`: compilación Android Release.

## Estado del proyecto

La prioridad actual es mantener el núcleo TTS pequeño, verificable y offline, eliminando progresivamente infraestructura heredada que no sea necesaria para esa función.
