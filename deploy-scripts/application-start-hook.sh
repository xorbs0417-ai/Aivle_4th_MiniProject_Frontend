#!/bin/bash

# 1. 기존의 잘못된 설정(proxy_pass 등)이 있는 파일을 삭제하거나 초기화합니다.
sudo rm -f /etc/nginx/conf.d/default.conf
sudo rm -f /etc/nginx/conf.d/app.conf

# 2. 프론트엔드(React/Vue 등) 배포를 위한 최적화 설정을 새로 만듭니다.
sudo tee /etc/nginx/conf.d/app.conf <<EOF
server {
    listen 80;
    server_name localhost;

    location / {
        # 우리가 빌드 파일을 복사해둔 경로입니다.
        root /var/www/html;
        index index.html index.htm;
        
        # React의 SPA 라우팅을 위해 필수적인 설정입니다.
        try_files \$uri \$uri/ /index.html;
    }

    # 캐시 설정 (필요시 추가)
    location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
        root /var/www/html;
        expires 30d;
        add_header Pragma public;
        add_header Cache-Control "public";
    }
}
EOF

# 3. Nginx 설정 문법 검사 후 재시작
sudo nginx -t && sudo systemctl restart nginx
