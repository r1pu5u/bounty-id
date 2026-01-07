FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Hapus --production agar semua library yang dibutuhkan terinstal
RUN npm install
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["node","server.js"]