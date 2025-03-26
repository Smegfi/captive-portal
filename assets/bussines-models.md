# Bussiness modely

1. [Uživatelské role](#uživatelské-role)
1. [Routy](#routy)


## Uživatelské role

![Uživatelské role](images/user-roles.svg)

## Routy

| Url | Název | Popis | Oprávnění |
| --- | ----- | ----- | --------- |
| /   | Hlavní stránka | Obashuje hlavní zobrazení pro běžné uživatele s možností vyplnění emailu a marketingového souhlasu | Uživatel |
| /login | Příhlášení | Stránka pro přihlášení k administrátorskému rozhraní, přihlášení probíhá pomocí Microsoft 365 | Any |
| /logout | Odhlášení | Stránka pro odhlášení uživatele | Přihlášený uživatel |
| /admin | Admin dashboard | Hlavní stránka pro administrátory, zobrazuje základní data po přihlášení administrátorovi | Administrátor |
| /admin/devices | Zobrazení zařízení | Zobrazuje zařízení uložená v databázi | Administrátor |
| /admin/users | Zobrazení uživatelů | Zobrazuje přehled vytvořených účtu pomocí captive-portálu | Administrátor |
| /admin/settings | Hlavní nastavení | Zobrazuje všechny možnosti nastavení captive-portálu | Administrátor |
| /tos | Terms of Service | Stránka bude zobrazovat stažitelný dokument podmínek použití veřejné wifi sítě | Uživatel |