#!/bin/bash

sudo sed -i 's|root /usr/share/nginx/html;|root /var/www/html;|g' /etc/nginx/nginx.conf

sudo sed -i 's|root root|root|g' /etc/nginx/nginx.conf

sudo systemctl restart nginx
