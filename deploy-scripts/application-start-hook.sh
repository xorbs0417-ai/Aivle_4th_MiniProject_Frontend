#!/bin/bash

# 1. 수동으로 성공했던 설정을 그대로 자동화 스크립트에 넣습니다.
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

# 2. Nginx 재시작
sudo systemctl restart nginx
