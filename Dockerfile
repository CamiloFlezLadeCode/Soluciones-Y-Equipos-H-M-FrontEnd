# Etapa 1: build
FROM node:24.14.1-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

# 🔥 UNA sola instalación bien hecha
RUN pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm run build

# Etapa 2: nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html/soluciones-y-equipos-h-y-m
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]