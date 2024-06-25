# Captive Portal
==============
Captive portal for ÚMČ Praha 10.

## INSTALATION
Here is quick guide on how to install and run this application / program

```bash
docker run --name [container_name] --e RUN=Debug -p [your_port]:5000 -idt --restart always smegfi/captive-portal
```

or via docker compose

```yml
version: '3'

services:
  web:
    image: smegfi/captive-portal
    environment:
      - RUN=Debug or Production
    ports:
      - '[your_port]:5000'
    restart: always
```

### DOCKER
[![Docker](https://img.shields.io/docker/image-size/smegfi/pozadavky)](https://hub.docker.com/r/smegfi/pozadavky)

## DOCUMENTATION

