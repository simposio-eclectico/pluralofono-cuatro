# Pluralófono TensorFlow

Pluralófono es una aplicación web interactiva que permite controlar la generación de sonidos mediante gestos de la mano capturados por la webcam, utilizando inteligencia artificial y tecnologías modernas de la web.

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
   git clone <url-del-repositorio>
   cd pluralofono-tensorflow
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```
3. **Inicia la aplicación:**
   ```bash
   npm run start
   # o
   yarn start
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
- Según el gesto y la posición detectada, se controla un oscilador de audio (frecuencia, volumen, tipo de onda) usando la Web Audio API.
- El flujo principal es:
  1. Inicialización de cámara y detector.
  2. Loop de predicción de gestos en tiempo real.
  3. Control de sonido según la mano y el gesto detectado.

## Créditos

- Basado en tecnologías de Google MediaPipe, TensorFlow.js y Fingerpose.
- Desarrollado para experimentación sonora y musical interactiva.

## Licencia

[MIT](LICENSE)
