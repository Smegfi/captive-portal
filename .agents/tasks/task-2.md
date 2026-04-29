# 🚀 Task #2 - Welcome email

Create welcome email feature, where we will send user welcome emails, after they create new account (guest-user)

# Key requirements

- [ ] Email message will be configurable in admin/settings
- [ ] Email will be send to only newly created users, if user allredy existed nothing will be send
- [ ] Use current SMTP configuration for message sending
- [ ] Check and if needed refactor SMTP service for email sending

## Email message

this is the email message that we will send

```text
Dobrý den,

děkujeme, že jste při připojení k bezplatné Wi-Fi síti MČ Praha 10 zvolil(a) možnost dostávat informace o novinkách a akcích Městské části Praha 10 e-mailem.

Aby bylo možné odběr novinek dokončit, je nutné provést registraci v systému MUNIPOLIS na následujícím odkazu:
https://praha10.munipolis.cz/registrace

Pokud registraci nedokončíte, k odběru novinek Vás nepřihlásíme a žádné další informace Vám v této souvislosti zasílány nebudou.

Tento e-mail Vám byl zaslán jednorázově na základě Vaší volby provedené v captive portálu při připojení k Wi-Fi síti MČ Praha 10. Další e-mail z tohoto procesu již zaslán nebude.

Pokud jste o odběr novinek nežádal(a), považujte prosím tento e-mail za bezpředmětný a dále jej ignorujte.

Více informací o podmínkách využívání Wi-Fi a zpracování osobních údajů naleznete zde:
[ODKAZ_NA_PODMINKY_A_OCHRANU_OSOBNICH_UDAJU]

V případě dotazů nás můžete kontaktovat na:
[KONTAKTNI_EMAIL]

S pozdravem,
Úřad městské části Praha 10
www.praha10.cz
```
