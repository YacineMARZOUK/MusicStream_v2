# Étape 1 : Build Angular (ON PASSE À NODE 20-ALPINE)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Adapte la commande de build si nécessaire
RUN npm run build -- --configuration=production

# Étape 2 : Serveur Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# ATTENTION : Vérifiez bien que le dossier ici correspond à votre angular.json
# Si votre projet s'appelle "music-stream" (avec tiret) ou "MusicStream" (CamelCase)
COPY --from=build /app/dist/MusicStream/browser /usr/share/nginx/html
EXPOSE 80
