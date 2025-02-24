# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./
#COPY tsconfig.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el contenedor
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["npm", "start"]
