FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

# Instalar dependencias
RUN npm ci

COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]