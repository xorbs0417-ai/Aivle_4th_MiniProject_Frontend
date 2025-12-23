#!/bin/bash

# 1. 백엔드용 설정을 지우고 프론트엔드(React)용 설정을 새로 작성합니다.
sudo tee /etc/nginx/conf.d/app.conf <<EOF
server {
    listen 80;
    server_name localhost;

    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# 2. 방해가 될 수 있는 기본 파일 삭제
sudo rm -f /etc/nginx/conf.d/default.conf

# 3. Nginx 재시작
sudo systemctl restart nginx
