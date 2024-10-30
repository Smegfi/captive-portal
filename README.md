# Captive Portal

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

### ENV Variables
| Povinný? | Název                   | Typ     | Popis           | 
| :------: |-------------------------|---------|-----------------|
| ✅       | CAPTIVEP10_DB_PATH      | text    | Absolutní cesta k souboru databáze|
| ✅       | CAPTIVEP10_ENVIRONMENT  | text    | Nastavení prostředí |
| ✅       | CAPTIVEP10_PORT         | text    | Port aplikace (5000) |
| ✅       | CAPTIVEP10_HOST         | text    | Aplikace naslouchá na (0.0.0.0) |
| ✅       | CAPTIVEP10_API_URL      | text    | Url na FG API |
| ✅       | CAPTIVEP10_API_TOKEN    | text    | Token pro komunikaci s FG API|


### PATHS

1. / - formulář pro uživatele
1. /health - zobrazuje informace o prostředí
1. /api-test - formálář pro testování loginu
1. /db-dump - zobrazí celou db
1. /api/create-user - vytvoří uživatele na FG
1. /api-post - testovací stránka API
1. /api-get - testovací stránka API