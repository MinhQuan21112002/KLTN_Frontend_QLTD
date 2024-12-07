# Sử dụng image Node.js chính thức
FROM node:16 AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của dự án vào container
COPY . .

# Build ứng dụng ReactJS
RUN npm run build

# Sử dụng image Nginx để phục vụ file tĩnh
FROM nginx:alpine

# Sao chép build output vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
