# Diseño de VozLocal - Aplicación de Text-to-Speech Offline

## Visión General
Una aplicación móvil minimalista que convierte texto a voz de forma completamente local. El usuario puede pegar texto, seleccionar configuraciones de voz y escuchar la lectura sin necesidad de internet.

## Pantallas

### 1. Pantalla Principal (Home)
**Contenido:**
- Área de entrada de texto (TextInput grande)
- Botón para pegar desde portapapeles
- Botón para limpiar texto
- Botón de reproducción (play/stop)
- Indicador de estado (reproduciendo, pausado, detenido)

**Funcionalidad:**
- Usuario toca el área de texto y escribe o pega
- Botón "Pegar" copia desde portapapeles
- Botón "Reproducir" inicia la lectura de voz
- Botón "Detener" pausa/detiene la reproducción
- Indicador visual muestra el progreso

### 2. Pantalla de Configuración (Settings)
**Contenido:**
- Selector de idioma/voz
- Control de velocidad (slider 0.5x - 2.0x)
- Control de tono (slider)
- Control de volumen (slider)
- Botón "Guardar preferencias"

**Funcionalidad:**
- Usuario ajusta parámetros de voz
- Los cambios se guardan en AsyncStorage
- Se aplican en tiempo real

## Flujos de Usuario Principales

### Flujo 1: Leer Texto Pegado
1. Usuario abre la app
2. Toca el área de texto
3. Toca "Pegar desde portapapeles"
4. Texto aparece en el área de entrada
5. Toca "Reproducir"
6. La voz comienza a leer

### Flujo 2: Escribir y Leer
1. Usuario abre la app
2. Escribe o pega texto directamente
3. Toca "Reproducir"
4. La voz lee el texto

### Flujo 3: Ajustar Configuración
1. Usuario va a la pestaña "Configuración"
2. Ajusta velocidad, tono, volumen
3. Vuelve a la pantalla principal
4. Los cambios se aplican automáticamente

## Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo | #FFFFFF (claro) / #151718 (oscuro) | Fondo general |
| Texto Principal | #11181C (claro) / #ECEDEE (oscuro) | Títulos y texto |
| Texto Secundario | #687076 (claro) / #9BA1A6 (oscuro) | Subtítulos |
| Botón Primario | #0a7ea4 | Botón "Reproducir" |
| Botón Secundario | #E5E7EB (claro) / #334155 (oscuro) | Botones secundarios |
| Área de Texto | #f5f5f5 (claro) / #1e2022 (oscuro) | Input de texto |
| Borde | #E5E7EB (claro) / #334155 (oscuro) | Bordes |

## Componentes Clave

- **TextInput**: Área para pegar/escribir texto
- **Button/Pressable**: Botones de acción (Reproducir, Pegar, Limpiar)
- **Slider**: Controles de velocidad, tono, volumen
- **Picker**: Selector de idioma/voz
- **ActivityIndicator**: Indicador de reproducción

## Consideraciones Técnicas

- Usar `expo-speech` para TTS offline
- Guardar preferencias en `AsyncStorage`
- Usar `expo-clipboard` para acceder al portapapeles
- Interfaz responsive para portrait mode
- Soporte para dark mode automático
