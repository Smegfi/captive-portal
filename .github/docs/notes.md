# Poznámky k testování UC-B-001

# Tvoření dokumentace
## Manuální implementace
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [1]
> Délka implementace            [27 min]

Do implementace jsem v druhé iteraci musel doplnit ještě funkci odstranění hledání na kterou jsem při první imlementaci zapomněl.


## AI - Context implementace
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [3]
> Délka implementace            [18 min]

Pro implementaci use-case byl použitý tento prompt:
``` prmpt
Based on this use-case template @template.md create use-case for filtration.

This filtration shoud take current /admin/tos page and based on user specified text it should search `Název` and `Název souboru` fields with full-text search. Have best-practises in mind when creating this use-case.

Use-case id is uc-b-001.
```

První implementace byla dobrá, ale chyběla zmíňka o query parametrech. AI ale podchitila všechny důležitosti, které jsou potřeba.

Do druhého promptu bylo od AI požádáno aby doplnila funcionalitu s query parametry pomocí tohoto promptu
``` prompt
You forgot about query params - each search should be stored inside query params.
```

Zde AI správně implementovala funkci ale zvolila špatný názezv query parametru, tento jsem ručně upravil a poté ještě požádal AI o doplnění funkce s resetováním paginace.
Pro doplnění byl použit tento prompt:
``` prompt
One more thing. There is also pagination function and when user fills out filtration this pagination should be set to 1 -> &page=1. Fix it
```

Následně již implementace proběhla v pořádku a všechny funkcionality byly doplněné.


## AI + Context implementace
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [0]
> Délka implementace            [10 min]

V implemetaci AI + context nyní doplním AI o dovednost grilling - tato dovednost zajistí že se AI před tím než dokument navrhne nejdříve zeptá na otázky ohledně implementace.

Otázka 1: How should the use-case describe the search/matching behavior?
> Document actual behavior: case-insensitive substring match (ilike) across Název and Název souboru, joined by OR

Otázka 2: Which behaviors should the use-case explicitly cover?
> All three: search, clear/reset, query-param, persistence, and pagination reset to page=1

Otázka 3: Which alternative flows should the use-case document?
> All three: empty/whoitespace term, no results, and clear/reset

Otázka 4: What priority should the use-case have? (Name recommended: 'Filtrování TOS dokumentů', actor: Administrátor)
> Střední

Na základě těchto odpovědí teprve AI začala vypracovávat use-case.

Use-case je kompletní na první dobrou není potřeba žádný zásah.

---

# Implementace testu

## Manuální implementace
> Počet puštění                 [17]
> Počet chybových puštění       [4]
> Počet manuálních zásahů       [0]
> Délka implementace            [35 min]

Implemetováno bylo celkem 10 testů, které kompletně pokrývají každý definovaný scénář.


## AI - Context implementace
> Počet puštění                 [14]
> Počet chybových puštění       [9]
> Počet manuálních zásahů       [7]
> Délka implementace            [27 min]

V rámci implementace byl popužit tento prompt
``` prompt
Based on this use case @.github/docs/use-cases/UC-B-001-filtrace-dokumentu-tos.md 
create new us-b-001.spec.ts playwright test file. Cover each scenario taht is 
specified in use-case.

Do not implement authentication, it will be implemented manually.
```
umělá inteligence nejříve začala kontrolovat use-case a na základě toho implementovala první fázy. V této jsem musel ručně nejdříve odstranit zmíňku o nastavení autentikaci, jelikož se nastavuje globálně. Dále byl problém při hledání, jelikož po zadání textu je potřeba odkliknout tlačítko v hlavní nabídce. Toto jsem doplnit do nového promptu. 

``` prompt
Good. I need you to add button click after filling seach field. 
Button can be found by this role: 
page.getByRole('button').nth(4).click();
```

Poté jsem musel ještě upravit parametr page, který AI nastavila špatně na null, kdežto po filtraci by měl být == 1

V další iteraci jsem musel opravit název hledané polžoky, jelikož byla špatně nastavená na text smlouva - upravil jsem na "TOS-"
Dále AI očekávala zobrazení informací o chybjících položkách, toto jsem musel také opravit

Dále bylo potřeba upravit klikání na tlačítka, která neexistovala. Nakonec bylo potřeba ještě upravit poslední test, ve kterém se také validovala hláška.

Po této úpravě všechny testy proběhly v pořádku. Je pozitivní že AI opět bez větších znalostí dokázala doplnit test, který s většími úpravy bylo možné zprovoznit v menším časovém rámci než u manuální implementace.


## AI + Context implementace
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       []
> Délka implementace            []