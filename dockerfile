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

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Tạo thư mục .well-known/acme-challenge cho Let's Encrypt
# RUN mkdir -p /usr/share/nginx/html/.well-known/acme-challenge

# Copy build của React app vào thư mục của nginx
COPY --from=build /app/build /usr/share/nginx/html

# Cấu hình nginx để phục vụ .well-known
#COPY nginx.conf /etc/nginx/nginx.conf

# Cổng mà nginx sẽ lắng nghe
EXPOSE 80
EXPOSE 443

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]