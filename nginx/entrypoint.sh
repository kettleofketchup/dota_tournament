#!/bin/sh
set -e

# Create config from template
envsubst < /etc/nginx/templates/default.template.conf > /etc/nginx/conf.d/default.conf

# Run Nginx
exec nginx -g 'daemon off;'
