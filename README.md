# Pluralófono 4: Theremin de dedos

**Pluralófono 4: Theremin de dedos** es una aplicación web interactiva que permite controlar la generación de sonidos mediante gestos de la mano capturados por la webcam, utilizando inteligencia artificial y tecnologías modernas de la web.

## Datos técnicos

- **Stack principal:** TypeScript, Vite, TensorFlow.js, MediaPipe, Web Audio API, fingerpose
- **Modelo de manos:** @tensorflow-models/hand-pose-detection (MediaPipe Hands)
- **Reconocimiento de gestos:** fingerpose + lógica personalizada
- **Audio:** Web Audio API, síntesis por osciladores independientes por dedo
- **Visualización:** Canvas 2D, trailing effect
- **Resolución recomendada:** 640x480 px
- **Requisitos:** Navegador moderno, webcam
- **FPS objetivo:** 30+ (dependiendo del hardware)
- **Docker-ready:** Sí, build estático para despliegue

## ¿Cómo funciona?

- Utiliza tu webcam para detectar las manos y reconocer gestos en tiempo real.
- Según el gesto y la posición de la mano, la aplicación genera y controla sonidos mediante la Web Audio API.
- Los gestos reconocidos permiten:
  - **Mano abierta**: Iniciar el sonido y controlar frecuencia/volumen moviendo la mano.
  - **Mano cerrada**: Detener el sonido.
  - **Índice arriba**: Cambiar el tipo de onda a "sawtooth" (diente de sierra).
  - Otros gestos pueden estar definidos en el código (`src/shared/signs.ts`).

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/simposio-eclectico/pluralofono-cuatro   
   cd pluralofono-cuatro
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Inicia la aplicación:**
   ```bash
   npm run start
   ```
4. Abre tu navegador en [http://localhost:5173](http://localhost:5173) (o el puerto indicado por Vite).

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, etc.)
- Acceso a una webcam

## Dependencias principales

- [@tensorflow/tfjs](https://www.npmjs.com/package/@tensorflow/tfjs)
- [@tensorflow-models/hand-pose-detection](https://www.npmjs.com/package/@tensorflow-models/hand-pose-detection)
- [@mediapipe/hands](https://www.npmjs.com/package/@mediapipe/hands)
- [fingerpose](https://www.npmjs.com/package/fingerpose)
- [vite](https://www.npmjs.com/package/vite)

## Explicación técnica

- El archivo principal es `src/index.ts`.
- Se inicializa la webcam y un detector de manos usando TensorFlow.js y MediaPipe.
- Se utiliza Fingerpose para reconocer gestos a partir de los puntos clave de la mano.
- Según el gesto y la posición detectada, se controla un sistema de **osciladores de audio independientes para cada dedo** usando la Web Audio API.
- El flujo principal es:
  1. Inicialización de cámara y detector.
  2. Loop de predicción de gestos en tiempo real.
  3. Control de sonido según la mano y el gesto detectado.

### Sistema de Osciladores por Dedo

Cada dedo de cada mano tiene su propio oscilador, con un tipo de onda diferente:

| Dedo   | Tipo de onda |
|--------|--------------|
| Pulgar | Sine         |
| Índice | Square       |
| Medio  | Triangle     |
| Anular | Sawtooth     |
| Meñique| Triangle     |

- **Extiende un dedo** para activar su oscilador.
- **La posición vertical (Y) de la punta del dedo** controla la frecuencia (más arriba = más agudo, más abajo = más grave).
- **La posición horizontal (X)** controla la ganancia/volumen.
- Puedes tocar varios dedos a la vez, generando acordes o texturas.
- Si un dedo no está extendido, su oscilador se silencia automáticamente.

### Visualización interactiva

- El canvas muestra la mano y los dedos detectados.
- Se implementa un efecto de "trailing" visual: los movimientos recientes de la mano dejan una estela semitransparente durante ~300ms, haciendo la experiencia más fluida y artística.

### Ejemplo de uso

- Abre la app y permite acceso a la webcam.
- Extiende distintos dedos y muévelos para explorar sonidos y timbres.
- Usa ambas manos para mayor complejidad sonora.

Para detalles sobre los gestos reconocidos, revisa `src/shared/signs.ts`.

## Créditos

- Basado en tecnologías de Google MediaPipe, TensorFlow.js y Fingerpose.
- Desarrollado para experimentación sonora y musical interactiva.
- Colectivo Simposio Ecléctico

## Licencia

[MIT](LICENSE)
