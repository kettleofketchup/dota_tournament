FROM nginx:1.27.4-bookworm

# Copy template and script
COPY default.template.conf /etc/nginx/templates/default.template.conf
COPY entrypoint.sh /entrypoint.sh

ENV DOMAIN=localhost
ENV FRONTEND_HOST=localhost
ENV FRONTEND_PORT=5471
ENV BACKEND_HOST=localhost
ENV BACKEND_PORT=8000

# Use custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]
