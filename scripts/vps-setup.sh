#!/bin/bash

set -euo pipefail

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading .env file..."
  source .env
else
  echo "Error: file .env not found."
  exit 1
fi

# Update package lists and upgrade installed packages
echo "Updating packages..."
sudo apt update -y && sudo apt upgrade -y

# Install dependencies: git, curl, certbot, docker, docker-compose, etc...
echo "Installing core dependencies..."
sudo apt install -y git curl certbot apt-transport-https ca-certificates software-properties-common apache2-utils gnupg nano

# Add Docker repository
echo "Adding the Docker repository..."
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list and install Docker
echo "Installing Docker..."
sudo apt update -y && sudo apt install -y docker-ce docker-ce-cli containerd.io

# Enable and start Docker service
echo "Starting the Docker service..."
sudo systemctl enable docker && sudo systemctl start docker

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

echo "Setup completed."
