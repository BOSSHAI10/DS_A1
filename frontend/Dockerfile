# Folosim o imagine oficială de Node.js (ușoară, bazată pe Alpine Linux)
FROM node:20-alpine

# Setăm directorul de lucru în container
WORKDIR /app

# Copiem fișierele de dependențe
COPY package*.json ./

# Instalăm dependențele
RUN npm install

# Copiem restul codului sursă
COPY . .

# Expunem portul pe care rulează Vite
EXPOSE 5173

# Comanda de start
# --host este CRITIC pentru ca Docker să permită accesul din browser
CMD ["npm", "run", "dev", "--", "--host"]