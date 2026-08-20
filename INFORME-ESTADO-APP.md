# Informe de estado de VVC Voice Sync

**Fecha de actualización:** 19 de agosto de 2026  
**Repositorio:** `the-VanCartier-Authority/VVC-VOICE-SYNC`  
**Rama de integración:** `fix/android-release-apk`  
**Rama destino:** `main`

## 1. Resumen ejecutivo

La aplicación se instalaba correctamente, mostraba la pantalla de splash y se cerraba antes de presentar la interfaz principal. La causa confirmada del APK descargado desde el workflow anterior de `main` fue que el workflow generaba una variante **debug** mediante `assembleDebug`. Ese APK no incluía el bundle JavaScript autónomo `assets/index.android.bundle`, por lo que fuera de un servidor Metro no podía iniciar la aplicación completa.

La corrección consiste en cambiar el workflow de Android a `assembleRelease` y publicar el APK desde la carpeta `android/app/build/outputs/apk/release/`. La corrección fue compilada localmente y también fue verificada por un workflow remoto exitoso en la rama `fix/android-release-apk`.

La corrección todavía debe integrarse en `main`, ejecutarse de nuevo desde `main` y probarse en un teléfono físico. Hasta completar esa prueba no debe considerarse cerrada la incidencia.

## 2. Problema original confirmado

El workflow anterior de `main` utilizaba:

```bash
./gradlew assembleDebug --no-daemon
```

Y publicaba:

```text
vvc-voice-sync-debug-apk
android/app/build/outputs/apk/debug/*.apk
```

El APK descargado desde el workflow `29271051668` tenía estas características:

| Elemento | Resultado |
|---|---|
| Variante | Debug |
| Bundle JavaScript | Ausente |
| Archivo `assets/index.android.bundle` | No incluido |
| Firma | Debug |
| Comportamiento observado | Splash y cierre inmediato fuera de Metro |

La evidencia anterior explica el síntoma mostrado en la captura del teléfono. La aplicación no fallaba durante la instalación; fallaba al intentar arrancar sin el bundle JavaScript necesario.

## 3. Corrección aplicada

El workflow fue modificado para ejecutar:

```bash
./gradlew assembleRelease --no-daemon
```

Y para publicar:

```text
vvc-voice-sync-release-apk
android/app/build/outputs/apk/release/*.apk
```

El APK release verificado contiene `assets/index.android.bundle`, tiene el paquete `com.vvc.voicesync`, versión `1.0.0`, versionCode `1` y firma válida mediante APK Signature Scheme v2.

La corrección se encuentra en el commit `0fd76db` de la rama `fix/android-release-apk`. El workflow remoto `31981676937` finalizó correctamente.

## 4. Estado de la integración STT

La integración STT se encuentra en la rama `feature/stt-expo-ai-kit`, commit `ddcd878`. Incluye `expo-ai-kit` versión `0.14.0`, el plugin Expo con `speech: true`, el hook `hooks/use-dictation.ts`, el control de dictado en la pantalla principal y el permiso `android.permission.RECORD_AUDIO`.

La integración TTS existente en `hooks/use-speech.ts` no fue modificada por esa integración.

Durante la compilación nativa de la rama STT se confirmó que la dependencia de ML Kit requiere `minSdkVersion 26`. Ese ajuste debe conservarse cuando se compile una versión que incluya STT.

## 5. Validaciones realizadas

| Validación | Resultado actual |
|---|---|
| TypeScript (`pnpm check`) | Correcto |
| Lint (`pnpm lint`) | Correcto, con una advertencia no bloqueante de configuración de módulos |
| Build backend (`pnpm build`) | Correcto |
| Tests (`pnpm test`) | El proceso termina, pero la única prueba configurada está marcada como `skipped`; no existe cobertura efectiva validada |
| Expo prebuild Android | Correcto |
| Compilación release local | Correcta |
| Workflow release remoto | Correcto, ejecución `31981676937` |
| Bundle JavaScript en APK release | Confirmado |
| Firma APK release | Válida con APK Signature Scheme v2 |
| Prueba en teléfono físico | Pendiente |

## 6. Pendientes antes de considerar la aplicación lista

Primero se debe fusionar la corrección del workflow en `main`. Después se debe ejecutar el workflow desde `main` y descargar el artefacto release generado por esa ejecución, no el artefacto histórico debug.

A continuación se debe desinstalar la versión anterior del teléfono, instalar el nuevo APK, abrir la aplicación y comprobar que supera el splash. También se debe verificar la navegación principal, el campo de texto, la función TTS, el permiso y funcionamiento del micrófono STT, el tratamiento de errores sin conexión y las pantallas de configuración y OAuth.

Cada resultado de la prueba física se añadirá a este informe con fecha, versión del APK, modelo y versión de Android del dispositivo, pasos ejecutados, resultado observado y evidencia disponible. Si aparece un cierre, se registrará el mensaje de Android o un `logcat` antes de realizar otra compilación.

## 7. Criterio de cierre de la auditoría

La incidencia de arranque se considerará cerrada únicamente cuando un APK generado desde `main` incluya el bundle JavaScript, se instale en el teléfono de prueba, supere la pantalla de splash y permita utilizar las funciones principales sin cierre inesperado.

La auditoría final deberá comprobar que el código fusionado, el workflow, el artefacto descargado, la versión instalada y las pruebas documentadas corresponden al mismo commit. Ninguna validación de una rama distinta debe presentarse como validación de `main`.

## Referencias

[1]: https://github.com/the-VanCartier-Authority/VVC-VOICE-SYNC/actions/runs/31981676937 "Workflow release corregido"
[2]: https://github.com/the-VanCartier-Authority/VVC-VOICE-SYNC/compare/main...fix%2Fandroid-release-apk?expand=1 "Comparación de la corrección con main"
[3]: https://github.com/the-VanCartier-Authority/VVC-VOICE-SYNC "Repositorio VVC-VOICE-SYNC"
