#!/bin/bash

# 1. Nginx의 기본 root 경로를 우리의 배포 경로(/var/www/html)로 변경
sudo sed -i 's|root /usr/share/nginx/html;|root /var/www/html;|g' /etc/nginx/nginx.conf

# 2. 'root root'와 같은 문법 오타가 있다면 'root'로 자동 수정
sudo sed -i 's|root root|root|g' /etc/nginx/nginx.conf

# 3. 변경된 설정을 적용하기 위해 Nginx 재시작
sudo systemctl restart nginx
