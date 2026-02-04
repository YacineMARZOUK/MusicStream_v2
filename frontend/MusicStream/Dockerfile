# Étape 1 : Build Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Adapte le chemin "build" si ton script package.json est différent
RUN npm run build --configuration=production

# Étape 2 : Serveur Nginx
FROM nginx:alpine
# Copie la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copie les fichiers compilés d'Angular vers Nginx
# ATTENTION: Vérifie si le dossier dist s'appelle "music-stream" ou "MusicStream" dans ton angular.json
COPY --from=build /app/dist/music-stream/browser /usr/share/nginx/html
EXPOSE 80
