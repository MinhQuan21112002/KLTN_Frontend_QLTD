# Sử dụng Node.js image chính thức
FROM node:16 AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies với --legacy-peer-deps
RUN npm install --legacy-peer-deps


# Sao chép toàn bộ mã nguồn vào container
COPY . .


# Expose cổng 80 để Nginx hoạt động
EXPOSE 80

# Khởi chạy Nginx
CMD ["npm", "start"]
