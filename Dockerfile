# Dockerfile para compilar y servir el sitio estático en Render
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instala dependencias (usa yarn si está disponible, si no npm)
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    else npm ci; fi

COPY . .

RUN pnpm run build || npm run build

# --- Etapa para servir el sitio estático ---
FROM nginx:alpine AS static-server

# Copia el build de Vite (por defecto en dist/)
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada de nginx si existe
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
