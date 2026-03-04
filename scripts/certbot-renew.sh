#!/bin/bash

set -euo pipefail

# === Configuration ===

SITE_DOMAIN=${SITE_DOMAIN:?Error: SITE_DOMAIN environment variable is required}
NGINX_CONTAINER=${NGINX_CONTAINER:?Error: NGINX_CONTAINER environment variable is required}

CERTS_DIR="/var/www/certs"  # full path to the directory mounted in the container
LOG_FILE="/var/log/certbot-renew.log"

# Ensure the log file can be written to
if ! touch "$LOG_FILE" 2>/dev/null; then
  echo "Error: Cannot write to log file $LOG_FILE"
  exit 1
fi

exec >> "$LOG_FILE" 2>&1

# === Functions ===

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

copy_and_reload_nginx() {
  log "Copying renewed certificates to mounted directory..."

  cp "/etc/letsencrypt/live/$SITE_DOMAIN/fullchain.pem" "$CERTS_DIR/fullchain.pem"
  cp "/etc/letsencrypt/live/$SITE_DOMAIN/privkey.pem" "$CERTS_DIR/privkey.pem"
  chmod 644 "$CERTS_DIR/fullchain.pem" "$CERTS_DIR/privkey.pem"

  log "Restarting Nginx container..."
  docker restart "$NGINX_CONTAINER"

  log "Nginx container restarted with new certificates."
}

# === Main ===

log "Starting certificate renewal check..."

certbot renew --quiet --deploy-hook "/bin/bash -c '$(declare -f copy_and_reload_nginx); copy_and_reload_nginx'" >> "$LOG_FILE" 2>&1

log "Certificate check completed."
