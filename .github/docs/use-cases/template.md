# UC-XXX: [Název případu užití]

| Pole                 | Hodnota                                |
| -------------------- | -------------------------------------- |
| **ID**               | UC-XXX                                 |
| **Název**            | [Krátký popisný název]                 |
| **Aktér**            | [Hlavní aktér, vedlejší aktéři]        |
| **Priorita**         | [Vysoká / Střední / Nízká]             |

---

## Specifikace obchodního případu užití

**Cíl:** [Co chce aktér dosáhnout a proč je to z obchodního hlediska důležité.]

**Rozsah:** [Co tento případ užití zahrnuje. Co je výslovně mimo rozsah.]

**Spouštěč:** [Událost nebo akce, která případ užití zahajuje — např. uživatel otevře captive portál, odešle formulář.]

**Kritéria úspěchu:** [Měřitelný výsledek, který z obchodního hlediska definuje úspěch.]

**Obchodní pravidla:**

- [Pravidlo 1 — omezení, politiky nebo validace, které musí platit]
- [Pravidlo 2]

---

## Předpodmínky

Podmínky, které musí platit **před** zahájením případu užití.

- [ ] [Systém/služba je dostupná — např. aplikace běží, databáze je dostupná]
- [ ] [Stav aktéra — např. uživatel je připojen k Wi-Fi, ještě není ověřen]
- [ ] [Data/konfigurace — např. požadovaná nastavení jsou k dispozici]
- [ ] [Externí závislost — např. FG API je dostupné, pokud je relevantní]

---

## Podmínky po dokončení

Podmínky, které musí platit **po** úspěšném dokončení případu užití.

- [ ] [Trvalý stav — např. vytvořena relace, uložen záznam]
- [ ] [Výsledek viditelný pro uživatele — např. uživatel získá přístup k síti, vidí potvrzení]
- [ ] [Vedlejší efekty — např. zapsán auditní log, zařazen e-mail do fronty]
- [ ] [Stav systému — např. aktualizovány počítadla, invalidována cache]

**Při selhání:** [V jakém stavu systém zůstane, pokud případ užití není dokončen — např. žádné částečné zápisy, uživatel zůstane neověřen.]

---

## Scénář úšpěšného průchodu

Hlavní průběh, kdy vše funguje podle očekávání.


| Krok | Aktér / Systém | Akce                                     |
| ---- | -------------- | ---------------------------------------- |
| 1    | [Aktér]        | [Zahajující akce]                        |
| 2    | [Systém]       | [Odpověď nebo zpracování]                |
| 3    | [Aktér]        | [Další akce]                             |
| 4    | [Systém]       | [Validace, uložení nebo externí volání]  |
| 5    | [Systém]       | [Konečný výsledek prezentovaný aktérovi] |


**Výsledek:** [Jednověté shrnutí úspěšného koncového stavu.]

---

## Alternativní průběhy

Odchylky od scénáře šťastné cesty. Odkazujte na číslo kroku ze **Scénáře šťastné cesty**, kde se průběh větví.

### AP-1: [Krátký název — např. Neplatný vstup]

- **Větvení v kroku:** [N]
- **Podmínka:** [Co tuto cestu způsobí]
- **Kroky:**
  1. [Akce systému/aktéra]
  2. [Obnova nebo ukončení]
- **Výsledek:** [Koncový stav — např. uživatel vidí chybu, může to zkusit znovu]

### AP-2: [Krátký název — např. Externí služba nedostupná]

- **Větvení v kroku:** [N]
- **Podmínka:** [Co tuto cestu způsobí]
- **Kroky:**
  1. [Systém detekuje selhání]
  2. [Záložní řešení nebo zpracování chyby]
- **Výsledek:** [Koncový stav]

### AP-3: [Krátký název — např. Uživatel zruší akci]

- **Větvení v kroku:** [N]
- **Podmínka:** [Co tuto cestu způsobí]
- **Kroky:**
  1. [Akce zrušení]
  2. [Úklid, pokud je potřeba]
- **Výsledek:** [Koncový stav — případ užití přerušen, předpodmínky obnoveny tam, kde je to relevantní]

---

## Poznámky

- [Otevřené otázky, odkazy na API dokumentaci, designová rozhodnutí nebo implementační nápovědy]
- [Mapování na routy, komponenty nebo proměnné prostředí]

