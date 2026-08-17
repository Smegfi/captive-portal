# Poznámky k testování UC-B-001
## Tvoření dokumentace
### Manuální implementace
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [1]
> Délka implementace            [27 min]

Do implementace jsem v druhé iteraci musel doplnit ještě funkci odstranění hledání na kterou jsem při první imlementaci zapomněl.


### AI - Context implementace
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


### AI + Context implementace
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

## Implementace testu

### Manuální implementace
> Počet puštění                 [17]
> Počet chybových puštění       [4]
> Počet manuálních zásahů       [0]
> Délka implementace            [35 min]

Implemetováno bylo celkem 10 testů, které kompletně pokrývají každý definovaný scénář.


### AI - Context implementace
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


### AI + Context implementace
> Počet puštění                 [1]
> Počet chybových puštění       [0]
> Počet manuálních zásahů       [0]
> Délka implementace            [9 min]

Pro implementaci byl použit stejný prompt jako u předešlé implementace. Jediný rozdíl bylo použití dovednost /grilling

Otázka 1: How should the tests pick search terms for assertions?
> A) Hard-code "TOS-" for the success path and a guaranteed non-match string (e.g. "zzz-no-tos-match-xyz") for AP-2 — assumes your seed/dev DB always has TOS rows with that substring.

Otázka 2: How should the tests handle authentication?
> A) Rely only on global storageState — each test starts with page.goto('/admin/tos') and no login steps in the spec (same idea as skipping auth in the ai-without-context run after manual cleanup).

Otázka 3: Question 3 — Should we add a separate test for opening /admin/tos?search=… directly?
> A) Yes — add a test like page.goto('/admin/tos?search=TOS-') and assert filtered rows, the term in the input, and search in the URL (covers the trigger explicitly).

Otázka 4: How should tests submit the search after filling the input?
> A) Always press Enter after fill() — one consistent interaction, no brittle nth() button selectors.

Otázka 5: How should we verify that search resets pagination to page=1?
> A) Dedicated pagination test — go to /admin/tos?page=2, search for TOS-, assert URL has page=1 (and search=TOS-). Repeat pattern for clear (AP-3): filter first, go to page 2 if possible, clear, assert page=1 and no search.

Otázka 6: How should we assert that filtered rows actually match the search term?
> A) Per-row check — for each visible tbody tr, assert the row text contains TOS- (case-insensitive). Simple, doesn’t pin exact column indices.

Otázka 7: Should we add a dedicated test for case-insensitive matching?
A) Yes — search for tos- (lowercase) and assert filtered rows still appear (same as TOS- success path, different casing).

AI v rámci implementace také rovnou ověřila zda testy fungují a opravila sama chybu.

AI Implementovala celkem 9 testů. AI obsáhla všechny scénaře definované v use-case a jedním zátahem splnila všechny požadavky.

# Poznámky k testování UC-C-001

## Dokumentace
### Manuální
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [0]
> Délka implementace            [23 min]

Imlementace dokumentu byla jednoduchá. Cílem celého use-case je umožnit administrátorovi nahrát 
dokument a provést jeho konverzi. Zde bude obtížné implementovat správně nahrávání souboru a jeho následná validace.

### AI - Context
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [3]
> Délka implementace            [16 min]

V rámci implementace AI bez kontextu očekávám hodně úprav, jelikož se jedná o dosti specifický use-case, kdy je potřeba nejdříve dokument nahrát až poté je umožněna jedno další úprava.

Pro první implementaci byl použit tento prompt
``` prompt
Based on this use-case template @template.md create new usecase. This use-case will have ID: UC-C-001. This new use-case will be about creating new entity. This entity will have Název, Soubor (attachement) and JeAktivní properties. When user uploads new file we should convert it into html text.

Use best practises when crafting this use-case.
```
V promptu jsem se snažil specifikovat pro AI dostatek informací aby měla alespoň malé povědomí. Při prvvní implementaci mě překvapilo že AI správně rozpoznala TOS a jednotlivé stránky, poté při kontrole jsem přišel na to že si tyto informace zjistila z historie konverzace, kde načetla informace z předešlých dokumentů.

První chyba se objevila v možnosti nahravaných dokuemntů, kde ai napsala i pdf přílohy, toto jsem upravil.
V druhé opravě jsem musel opravit zmíňku o auditním záznamu, toto nepodporujeme
Dále jsem musel odstranit zmíňku o velikosti soboru, byť se jendá o dobrou pripomínku v našem systému nemáme toto omezení.

Na konci mě překvapily poslední 2 rádky, kdy AI napsala 2 otevřené otázky, které by bylo dobré zodpovědět:
``` markdown
- Otevřená otázka: má administrátor vidět náhled vygenerovaného HTML obsahu před finálním uložením?
- Otevřená otázka: má být po úspěšném vytvoření přesměrování na seznam, nebo na detail nového dokumentu?
```

V agentním režimu by se na tyto otázky AI sama zeptala, ale je hezké že to zde alespoň uživateli zobrazí.
Use case je jinak velmi kvalitní až na pár drobných odchylek. AI pokryla všechny scénaře a také přidala alternativní scénaře, které jsou určitě velmi vhodné:
AP-5 Duplnicitní název - velmi dobrá připomínka
AP-7 Zrušení akce - také velmi dobrý alternativní scénař

### AI + Context
> Počet puštění                 []
> Počet chybových puštění       []
> Počet manuálních zásahů       [0]
> Délka implementace            [12 min]

Pro implementaci v rámci AI + Context použiju stejný prompt jako u předešlé implementace ovšem s opět doplněnou dovedností /griling.

``` prompt
Based on this use-case template @.github/docs/use-cases/template.md create new usecase. This use-case will have ID: UC-C-001 (stored inside @.github/docs/use-cases/ai-with-context/. This new use-case will be about creating new entity. This entity will have Název, Soubor (attachement) and JeAktivní properties. When user uploads new file we should convert it into html text.

Use best practises when crafting this use-case.

/grilling 
```

AI nejdříve začala implementaci standartně prohlížením souborů v adresáři.

Otázky:
``` markdown
# Otázka 1: O jakou entitu přesně jde?
> Vázat use-case na TOS dokument.

# Otázka 2: Co přesně znamená pole JeAktivní?
> Zachovat stávající chování s checkboxem „Aktivovat ihned po nahrání“ a plnou aktivací v transakci. Odpovídá to implementaci i obchodnímu významu TOS — aktivní dokument je ten, který hosté vidí na portálu. Vedlejší efekty aktivace patří do obchodních pravidel use-case.

# Otázka 3: Jaké formáty souboru jsou povolené?
> Povolit jen .docx. Implementace to tak má (accept=".docx", validace v uploadTosSchema a create.ts), konverze do HTML probíhá přes Mammoth, které pracuje s DOCX. PDF ani jiné formáty nejsou v systému podporované — zahrnutí PDF do use-case by bylo chybné (to byla jedna z chyb z první AI implementace v poznámkách).

# Otázka 4: Má administrátor vidět náhled vygenerovaného HTML před finálním uložením?
> Uložit rovnou bez náhledu v rámci UC-C-001. Aktuální flow (upload-tos.tsx) funguje tak, že po odeslání formuláře systém konvertuje, uloží a zavře dialog. Úprava HTML je samostatná operace přes TosEditor u neaktivních dokumentů. Náhled před uložením by rozšířil rozsah use-case o nové UI a kroky, které v systému nejsou.

# Otázka 5: Kam má systém přesměrovat administrátora po úspěšném vytvoření?
> Zůstat na seznamu a zavřít dialog. To odpovídá stávající implementaci (onSuccess v upload-tos.tsx volá setIsOpen(false) a revalidatePath("/admin/tos")). Uživatel hned vidí nový řádek v tabulce. Samostatná detail stránka pro TOS v projektu neexistuje.

# Otázka 6: Musí být Název TOS dokumentu unikátní?
> Duplicity nejsou povolené.

# Otázka 7: Kdo smí vytvořit nový TOS dokument?
> Pouze administrátor.

# Otázka 8: Co se stane, když konverze DOCX → HTML selže?
> Zcela zrušit operaci. V create.ts konverze probíhá před zápisem do DB; při chybě se vyhodí výjimka, transakce se neprovede a administrátor vidí chybovou hlášku v dialogu. Žádný částečný stav.

# Otázka 9: Jaká je priorita tohoto use-case?
> Vysoká
```

Zvláštní je že se AI najendou rozhodla pokládat otázky v češtině i když až do této doby jsem komunikoval vždy v češtině. (Při aktualizaci systému se upravil můj primární jazyk na ČJ AI toto zaznamenala.)

Vytvoření dokumentace proběhlo naprosto v pořádku. use-case obsahuej všechyn potřebané informace a obsáhl všechny alternativní cesty. Opět zafungovala dovednost grilling, která naprosto precizne provedla dotazování na důležité otázky.

Nebylo nutné manuálního zásahu.

--- 

## Implementace
### Manuální
> Počet puštění                 [17]
> Počet chybových puštění       [4]
> Počet manuálních zásahů       []
> Délka implementace            [54 min]

Tak po skoro hodině jsem implementoval všechny testy. Implementace byla již náročnější kvůli složitým selectům v tabulce, aby bylo skutečně ověřeno že se uživateli zobrazuje to co je potřeba.

Implementováno bylo celkem 7 testů.

### AI - Context
> Počet puštění                 [10]
> Počet chybových puštění       [7]
> Počet manuálních zásahů       [7]
> Délka implementace            [20:17 - 22:57]

Prompt byl na začátek použit:
``` prompt
Based on this use-case @.github/docs/use-cases/UC-C-001-vytvoreni-dokumentu-tos.md 
implement create new uc-c-001.spec.ts playwright test file. 
Cover each scenario specified in use-case.

Do not implement authentication it is implemented in configuration 
automatically for each test.
```

Ai začala hnedka pracovat na testech a za malou chvilku bylo ipmlementováno.

Po vygenerování testů jsem musel ručně doplnit názvy testovacích souborů.
Dále jsem musel odstranit test číslo AP-4, který byl specifikovaný v dokumentaci proto to nebudu počítat jako manuální úpravu.

Byla potřeba velká úprava jelikož AI špatně ipmlemetnovala vytváření nového TOS dokumentu (mysela si že to je /tos/new)
``` prompt
There is nothing like TOS_NEW_URL. We only support dialog window that can be displayed after clicking button with "Přidat dokument" text. Please fix this.
```

Dále bylo potřeba trochu usměrnit AI jelikož s dobrou myšlenkou implemetovala naprosto zbytečnou zátěž. Upravil jsem tímto promptem
``` prompt
You are checking if "Název dokumentu" field is visible before every test. This is not necessary. Create only single test-case taht will check if Dialog is visible and if "Název dokumentu" and "Soubor" fields are visible.
```

Toto již opravilo chyby s neustálím testováním, nyní nastal ještě problém s uploadováním souboru. Toto jsem opět musel pomocí AI pomocí promptu:

``` prompt
Now about file uploading. There i button "Soubor" visible on site. I want you to implement page.waitForEvent("filechooser");. First of all test will click on button (Soubor) and then playwright will setFile.
```

Poté jsem musel ještě manuálně upravit selector pro "je aktivní"

Dále bylo potřeba upravit také selector pro tlačítko.

Další úpravou byla správná kontrola zobrazení TOS pomocí selectoru řádku

``` prompt
I need you to fix tests after user upload file. We need to check if new table row with text appeared (is visible). Apply getByRole("row") with filter hasText. This row is the new added document.
```

Toto následně vyřešilo všechny problémy. Testy proběhly v pořádku.

Testy jsou dobře strukturované. Na můj vkus je v testech až moc abstrakce, pokud se dostanu do nějakého testovacího scénaře, chtěl bych vidět jaké jsou aktuálně kroky, na co se klikno a na co se klikat bude. Přílišná abstrakce zajistí akorát neustálé překlikávání mezi referencemi. Při programování dává abstrakce smysl, ale pokud se k testu vrátím za 3 dny už nevím co metoda submit form reálně znamená. Vyplňuje to pole? Nebo to jenom kliká na tlačítko?.


### AI + Context
> Počet puštění                 [1]
> Počet chybových puštění       [0]
> Počet manuálních zásahů       []
> Délka implementace            [23:05 - 23:17]

Pro první implemetaci byl použit stejný prompt akorát opět s použitím dovednost /grilling.

```prompt
Based on this use-case @.github/docs/use-cases/ai-with-context/uc-c-001.md
implement create new uc-c-001.spec.ts (inside @tests/ai-with-context/)playwright test file. 
Cover each scenario specified in use-case.

/grilling 
```

Ai opět začala načítáním struktury, zkontrolovala doménové definice TOS dokumentu a začala dotazování - tentokrát zase v angličitně :D

``` markdown
# Question 1 — Test data isolation
> A — unique names, no cleanup. It matches how your other ai-with-context tests work (they assume a running app + DB, not a pristine fixture), keeps each test self-contained, and avoids cleanup plumbing. The notes also favor explicit, readable steps over heavy helpers; unique names fit that style.

# Question 2 — AP-4 and AP-5 (failure scenarios hard to trigger in E2E)
> B — test AP-4 with an invalid file (you already have test.pdf in tests/ai-with-context/; uploading it as .docx or using a truncated file should hit Mammoth or extension validation). Skip AP-5 in E2E: simulating disk/DB failure from the browser is brittle and doesn't belong in this layer.

# Question 3 — AP-3 (duplicitní název)
> B — skip AP-3 for now with a short comment referencing the use case. The E2E test should reflect current behavior; adding a failing test for unimplemented logic creates noise. You can add AP-3 when uniqueness is implemented in create.ts.

# Question 4 — AP-7 (nepřihlášený / neoprávněný uživatel)
> Skip AP-7 — auth is already covered in uc-a-001; TOS upload auth is redundant

# Question 5 — Success path: JeAktivní (setActive)
>  B — two focused success tests. They map directly to the use case criteria without extra coupling to whatever happens to be active in the DB. Option C is fragile (depends on seeded state) and goes beyond what the other ai-with-context specs assert.

# Question 6 — File upload interaction
> B — waitForEvent('filechooser') + click on the file input, then setFiles. It matches what worked in your manual run and exercises the same path a user takes.
```

Opět se ukazuje že dotazování je důležitou součástí kvalitních testů, jelikož se jedná o naprosto relevatní otázky, na které by se ptal i programátor.

AI okamžitě po dotvoření testu začala sama od sebe testovat a opravovala i chyby, které u testu našla.

Všechny testy funguji napoprvé a není jim co vytknout. Zde AI nevyužívala tolik abstrakce jako u předešlé varianty a testy jsou čitelnější. Naprosto fámozní.