<img width="1706" height="922" alt="Image" src="https://github.com/user-attachments/assets/b1e489f1-bf03-4bb5-8ca3-3bd530c7ff55" />
<img width="1774" height="887" alt="Image" src="https://github.com/user-attachments/assets/7356e062-7b8b-45d2-a09d-3c760d5cc2a3" />

# VVC Voice Sync - Lector de Texto a Voz Offline (Cyberpunk Edition)

## Introducción

VVC Voice Sync es una aplicación móvil diseñada para convertir texto a voz de manera completamente offline, utilizando los motores de voz nativos de tu dispositivo Android o iOS. Con una estética cyberpunk y una interfaz intuitiva, te permite pegar cualquier texto y escucharlo al instante, sin necesidad de conexión a internet ni APIs externas. Ideal para leer artículos, documentos o cualquier contenido textual sobre la marcha.

## Características

-   **Conversión de Texto a Voz Offline**: Utiliza los motores TTS nativos del sistema operativo para funcionar sin conexión a internet.
-   **Interfaz Cyberpunk**: Diseño futurista con colores neón (cian y magenta) y tipografía tecnológica.
-   **Pegar desde Portapapeles**: Copia texto fácilmente desde cualquier aplicación y pégalo directamente en VVC Voice Sync.
-   **Controles de Voz**: Ajusta la velocidad, el tono y el volumen de la voz para una experiencia personalizada.
-   **Selección de Idioma/Voz**: Elige entre las voces disponibles en tu dispositivo.
-   **Multiplataforma**: Compatible con Android e iOS.

## Instalación y Ejecución (Modo Desarrollo)

Para ejecutar VVC Voice Sync en tu entorno de desarrollo, sigue estos pasos:

1.  **Clonar el Repositorio**:
    ```bash
    git clone https://github.com/the-VanCartier-Authority/VVC-NEXUS-PURGE.git # (Asumiendo que el código se alojará aquí)
    cd VVC-NEXUS-PURGE/offline-tts-app
    ```

2.  **Instalar Dependencias**:
    Asegúrate de tener `pnpm` instalado. Si no, puedes instalarlo con `npm install -g pnpm`.
    ```bash
    pnpm install
    ```

3.  **Iniciar el Servidor de Desarrollo**:
    ```bash
    pnpm dev
    ```
    Esto iniciará el Metro Bundler de Expo. Escanea el código QR con la aplicación Expo Go en tu teléfono (Android o iOS) para ver la aplicación en tu dispositivo.

## Compilación (Producción)

Para generar un archivo APK (Android) o IPA (iOS) para su distribución, se recomienda utilizar el proceso de compilación de Expo. **No intentes compilar manualmente dentro del entorno sandbox, ya que puede agotar los recursos.**

1.  **Guardar un Checkpoint**: Asegúrate de que todos tus cambios estén guardados en un checkpoint. En el entorno de desarrollo de Manus, esto se hace con la función `webdev_save_checkpoint`.

2.  **Publicar la Aplicación**: Una vez que el checkpoint esté guardado, utiliza el botón **"Publish"** en la interfaz de usuario de Manus. Esto iniciará el proceso de compilación en la nube de Expo, generando los binarios de la aplicación (APK/IPA) que podrás descargar.

    *   **Para Android**: Se generará un archivo `.apk` o `.aab`.
    *   **Para iOS**: Se generará un archivo `.ipa`.

## Uso de la Aplicación

### Pantalla Principal (Home)

1.  **Ingresar Texto**: Puedes escribir directamente en el área de texto o usar el botón **"PEGAR"** para copiar contenido desde el portapapeles de tu dispositivo.
2.  **Limpiar Texto**: El botón **"LIMPIAR"** borrará todo el texto del área de entrada.
3.  **Reproducir/Detener**: Toca el botón principal **"REPRODUCIR"** para que la aplicación lea el texto en voz alta. Si ya está reproduciendo, el botón cambiará a **"DETENER"** para pausar o detener la lectura.
4.  **Indicador de Estado**: Verás un indicador visual que muestra si la aplicación está reproduciendo audio.

### Pantalla de Configuración (Settings)

1.  **Idioma / Voz**: Selecciona el idioma y la voz que prefieras de las opciones disponibles en tu dispositivo.
2.  **Velocidad**: Ajusta la velocidad de la lectura usando el deslizador.
3.  **Tono**: Modifica el tono de la voz (más grave o más agudo) con el deslizador.
4.  **Volumen**: Controla el volumen de la reproducción.

Todos los cambios en la configuración se guardan automáticamente y se aplican en tiempo real.

## Personalización

Si deseas personalizar la aplicación, puedes modificar los siguientes archivos:

-   `theme.config.js`: Para ajustar la paleta de colores cyberpunk.
-   `app.config.ts`: Para cambiar el nombre de la aplicación, el slug y la URL del logo.
-   `assets/images/icon.png`: Reemplaza este archivo con tu propio icono de aplicación.
-   `app/(tabs)/index.tsx` y `app/(tabs)/settings.tsx`: Para modificar la interfaz de usuario y la lógica de las pantallas.

---

<img width="1248" height="832" alt="Image" src="https://github.com/user-attachments/assets/c1e2d082-ba62-468f-a0f1-5df7079c40c9" />
<img width="1024" height="1024" alt="Image" src="https://github.com/user-attachments/assets/9573b7a2-344f-4c60-8df6-377c06651dfc" />
