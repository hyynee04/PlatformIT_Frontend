# Bước 1: Sử dụng image node để build app
FROM node:18 as build

WORKDIR /app

# Copy package.json và package-lock.json và cài đặt các dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build React app
COPY . ./
RUN npm run build

# Bước 2: Sử dụng nginx để chạy ứng dụng
FROM nginx:alpine

# Copy build của React app vào thư mục của nginx
COPY --from=build /app/build /usr/share/nginx/html

# Cổng mà nginx sẽ lắng nghe
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]