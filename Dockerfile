# # Etapa de construcción
# FROM node:18-alpine AS builder

# WORKDIR /app

# # Copia los archivos de configuración de Yarn y package.json
# COPY package.json yarn.lock ./

# # Instala las dependencias de desarrollo
# RUN yarn install --frozen-lockfile

# # Copia el resto del código fuente y construye la aplicación
# COPY . .
# RUN yarn build

# # Etapa de producción
# FROM node:18-alpine AS production

# WORKDIR /app

# # Copia solo los archivos necesarios desde la etapa de construcción
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules

# # Establece la variable de entorno para producción
# ENV NODE_ENV=production

# # Ejecuta la aplicación
# CMD ["node", "dist/main.js"]

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]