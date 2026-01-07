import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";

export function TosDisclaimer() {
   return (
      <p className="text-sm text-center text-muted-foreground">
         Kliknutím na tlačítko <span className="text-primary">Připojit se</span> souhlasíte s{" "}
         <Dialog>
            <DialogTrigger asChild>
               <span className="text-primary underline cursor-pointer">podmínkami použítí Wi-Fi</span>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:max-w-3xl px-0 sm:px-4">
               <DialogHeader>
                  <DialogTitle>Podmínky použítí Wi-Fi</DialogTitle>
               </DialogHeader>
               <ScrollArea className="h-[80dvh] w-full">
                  <center>Městská část Praha 10</center>
                  <center>Vinohradská 3218/169</center>
                  <center>100 00 Praha 10</center>
                  <center>IČO: 00063941</center>

                  <br />
                  <center>VŠEOBECNÉ PODMÍNKY PRO POSKYTOVÁNÍ A UŽÍVANÍ BEZPLATNÉ VEŘEJNÉ WI-FI SÍTĚ</center>
                  <center>(dále jen „Podmínky“)</center>

                  <center>ze dne 15. 07. 2025</center>

                  <p>
                     <strong>1. Vymezení pojmů</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>
                        Pro účely těchto Podmínek se rozumí:
                        <ul className="list-disc ml-8">
                           <li>„Bezdrátovou Wi-Fi sítí“ bezdrátová veřejná Wi-Fi síť s názvem MCP10-Free-WiFi;</li>
                           <li>
                              <span>„Poskytovatelem“ Úřad městské části Praha 10, se sídlem Vinohradská 3218/169, 100 00 Praha 10, IČO: 000 63 941;</span>
                           </li>
                           <li>„Prostorami“ – prostory, ve kterých sídlí Poskytovatel;</li>
                           <li>„Službou“ bezplatný přístupu k internetu prostřednictvím Bezdrátové Wi-Fi sítě;</li>
                           <li>„Uživatelem“ všechny fyzické osoby využívající Službu;</li>
                           <li>„Zařízením“ zařízení používané k připojení k Službě (tj. mobilní telefon, tablet nebo přenosný počítač Uživatele, aj.).</li>
                           <li>
                              „Osobními údaji“ veškeré informace týkající se identifikované nebo identifikovatelné fyzické osoby (dále jen „subjekt údajů“),
                              kterou lze přímo či nepřímo identifikovat, a to v souladu s článkem 4 nařízení (EU) 2016/679 (Obecné nařízení o ochraně osobních
                              údajů, dále jen „GDPR“), zejména:
                              <ul className="list-disc ml-8">
                                 <li>emailová adresa Uživatele.</li>
                              </ul>
                           </li>
                           <li>
                              „Provozními údaji“ technické a jiné údaje zaznamenávané Poskytovatelem v souvislosti s používáním Služby Uživateli, zejména:
                              <ul className="list-disc ml-8">
                                 <li>IP adresa zařízení Uživatele,</li>
                                 <li>MAC adresa zařízení,</li>
                                 <li>typ připojení,</li>
                                 <li>identifikátor uživatelského účtu,</li>
                                 <li>časové údaje o připojení a odpojení ze Sítě,</li>
                                 <li>označení přístupového bodu,</li>
                                 <li>cílové adresy komunikace,</li>
                                 <li>přenosové protokoly a použitá portová spojení,</li>
                                 <li>objem přenesených dat.</li>
                              </ul>
                           </li>
                        </ul>
                     </li>
                  </ol>
                  <p>
                     <strong>2. Účel a závaznost Podmínek</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>Podmínky se vydávají za účelem stanovení pravidel pro poskytování a užívaní Služby v rámci Prostor.</li>
                     <li>
                        Poskytování Služby je založeno na principu dobrovolnosti a probíhá v souladu s těmito Podmínkami, které Uživatel potvrzuje přijetím
                        prostřednictvím přihlašovacího rozhraní při prvním připojení ke Službě. Souhlas s Podmínkami je nezbytný k využívání Služby a je
                        podmínkou jejího poskytování.
                     </li>
                     <li>Podmínky a pravidla v nich zahrnutá jsou závazná pro všechny Uživatele.</li>
                  </ol>
                  <p>
                     <strong>3. Určení, dostupnost a bezplatnost Služby</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>Služba je primárně určená pro návštěvníky Poskytovatele.</li>
                     <li>Rozsah služby, použité technologie a podmínky poskytování Služby jsou plně v kompetenci Poskytovatele.</li>
                     <li>Bezdrátová Wi-Fi síť je majetkem Poskytovatele.</li>
                     <li>Přístup ke Službě je určen v Prostorách.</li>
                     <li>Uživatelé mohou Službu využívat bezplatně a po opětovném přijetí Podmínek podle čl. 4.8 bez časového omezení.</li>
                     <li>
                        Na užívaní Služby neexistuje jakýkoliv právní nárok, Služba slouží pouze ke zpříjemnění čerpání standardních služeb Poskytovatele, a
                        tedy jako nadstandardní služba pro Uživatele.
                     </li>
                     <li>Služba může být kdykoli ukončena, a to i bez předchozího upozornění.</li>
                  </ol>
                  <p>
                     <strong>4. Připojení Uživatele</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>
                        Zajištění kompatibility Zařízení a jeho programového vybavení, jakož i jejich vhodnosti a funkčnosti pro účely užívaní Služby, jsou
                        výhradně záležitostí Uživatele.
                     </li>
                     <li>Poskytovatel v souvislosti s čl. 4.1 nezpřístupňuje žádný software, zařízení ani konfigurační nastavení.</li>
                     <li>
                        Uživatel není oprávněn připojovat k Bezdrátové Wi-Fi síti bezdrátová síťová zařízení (tj. např. Wi-Fi přístupový bod, hotspot Uživatele
                        či Wi-Fi klientskou stanici).
                     </li>
                     <li>
                        Poskytovatel Bezdrátové Wi-Fi sítě upozorňuje Uživatele, že Bezdrátová Wi-Fi síť není z technického hlediska zabezpečena. Z této
                        skutečnosti pramení riziko možnosti odposlechu komunikace Uživatele třetí osobou v případě, že obsah komunikace odesílané Uživatelem ze
                        Zařízení do sítě internetu prostřednictvím Bezdrátové Wi-Fi sítě nebude zabezpečen.
                     </li>
                     <li>
                        Poskytovatel přiděluje automatické adresy z neveřejného rozsahu IP adres dle RFC 1918. Aby mohl Uživatel Bezplatnou Wi-Fi síť využívat,
                        musí mít nastaveno na příslušném rozhraní bezdrátové sítě automatické přidělování IP adres (protokol DHCP).
                     </li>
                     <li>Po připojení Zařízení k Bezdrátové Wi-Fi síti je Uživateli zobrazena přihlašovací stránka s informacemi pro Uživatele.</li>
                     <li>
                        Pro využívání Služby je ze strany Uživatele vyžadováno přijetí těchto Podmínek. Opětovné přijetí Podmínek může být vyžadováno po
                        uplynutí stanovené doby od posledního přijetí nebo při změně konfigurací na síti, a to jako podmínka pro další využívání Služby.
                     </li>
                     <li>
                        Uživatel je povinen respektovat jakékoliv změny v podmínkách připojení k Bezdrátové Wi-Fi síti a jakoukoli změnu těchto Podmínek
                        vykonanou Poskytovatelem.
                     </li>
                     <li>Přenosová rychlost Uživatele může být omezena.</li>
                     <li>
                        Provoz na Bezdrátové Wi-Fi síti může být omezen za účelem zajištění její bezpečnosti a efektivního fungování. Poskytovatel si vyhrazuje
                        právo povolit pouze vybrané komunikační protokoly nebo omezit přístup k určitým službám a portům podle aktuálních technických a
                        bezpečnostních požadavků.
                     </li>
                  </ol>
                  <p>
                     <strong>5. Práva a povinnosti Uživatele</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>Uživatel nese plnou odpovědnost za činnosti, které vykonává prostřednictvím Služby.</li>
                     <li>Uživatel je povinen užívat Službu v souladu s těmito Podmínkami.</li>
                     <li>
                        Uživatel nesmí při užívání Služby vykonávat jakoukoli činnost, která by mohla ohrozit či nerušit funkčnost nebo bezpečnost Služby a
                        softwaru Poskytovatele nebo ostatních Uživatelů.
                     </li>
                     <li>
                        Uživatel v souladu s čl. 5.3 nesmí zejména:
                        <ul className="list-disc ml-8">
                           <li>přetěžovat Bezdrátovou Wi-Fi síť;</li>
                           <li>
                              užívat Bezdrátovou Wi-Fi síť k jakýmkoli komerčním účelům, pro reklamní účely, šíření obchodních informací či pro náboženskou,
                              politickou nebo společenskou agitaci;
                           </li>
                           <li>šířit jakékoli druhy počítačových virů či programů schopných modifikace nebo replikace;</li>
                           <li>podílet se na kybernetických útocích;</li>
                           <li>rozesílat nevyžádané zprávy či IP pakety s falešnou adresou odesílatele;</li>
                           <li>šířit nelegální obsah;</li>
                           <li>šířit poplašné zprávy či nepravdivé informace.</li>
                        </ul>
                     </li>
                     <li>
                        Uživatel dále v průběhu užívání Služby nesmí porušovat platné právní předpisy, zejména zákon č. 121/2000 Sb. o právu autorském, o
                        právech souvisejících s právem autorským a o změně některých zákonů (autorský zákon), zákon č. 40/2009 Sb., trestní zákoník, ve znění
                        pozdějších předpisů, nebo dobré mravy.
                     </li>
                     <li>Uživatel nesmí měnit nastavení jakýchkoli parametrů aktivních prvků Bezdrátové Wi-Fi sítě.</li>
                     <li>
                        Uživatel je povinen Poskytovateli neprodleně ohlásit případné získání uživatelských práv nebo jakéhokoli privilegovaného stavu, který mu
                        nepřísluší.
                     </li>
                     <li>Odpovědnost za případné škody na technickém vybavení nebo datech Uživatele nese sám Uživatel.</li>
                     <li>
                        <p>
                           Uživatel je povinen dbát o zabezpečení informací, které jsou z jeho strany do Bezdrátové Wi-Fi sítě poskytované či v Bezdrátové Wi-Fi
                           síti přenášené.
                        </p>
                     </li>
                  </ol>
                  <p>
                     <strong>6. Práva a povinnosti Poskytovatele</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>Poskytovatel zajišťuje provádění technické údržby přístupu ke Službě.</li>
                     <li>
                        Poskytovatel je oprávněn podle vlastního uvážení přerušit, zablokovat nebo jinak omezit užívání Služby některými Uživateli, a to i bez
                        předchozího upozornění, zejména v případech porušování ustanovení těchto Podmínek.
                     </li>
                     <li>
                        V případě podezření ze závažného porušování ustanovení těchto Podmínek mohou být ze strany Poskytovatele vůči Uživateli využity
                        odpovídající právní instituty.
                     </li>
                     <li>Poskytovatel je oprávněn kdykoli, bez udání důvodu a bez náhrady, ukončit poskytování Služby.</li>
                     <li>Poskytovatel není povinen poskytovat servis ani žádné další služby na programovém nebo technickém vybavení Zařízení Uživatele.</li>
                     <li>
                        Poskytovatel je oprávněn veškeré informace a údaje týkající se Uživatele, včetně údajů osobních, provozních a lokalizačních, užívat
                        pouze v souladu s platnými právními předpisy České republiky.
                     </li>
                     <li>
                        Provoz na síti je monitorován a analyzován. Osobní údaje a Provozní údaje Uživatele jsou shromažďovány z legislativních důvodů a za
                        účelem oprávněného zájmu Poskytovatele výhradně za účelem zajištění funkčnosti, bezpečnosti a ochrany Bezdrátové Wi-Fi sítě, prevence a
                        detekce neautorizovaného přístupu nebo zneužití sítě, optimalizace provozu sítě a plnění povinností stanovených platnými právními
                        předpisy.
                     </li>
                     <li>
                        Poskytovatel si vyhrazuje právo poskytnout informace o Uživateli, včetně Osobních a Provozních údajů, orgánům činným v trestním řízení,
                        a to výhradně na základě zákonného požadavku, například soudního příkazu, příkazu k odposlechu, dohledu nad přenosem dat nebo jiné formy
                        oprávněného nařízení stanoveného platnými právními předpisy České republiky.
                     </li>
                  </ol>
                  <li>
                     <p>
                        <strong>7. Vyloučení odpovědností Poskytovatele</strong>
                     </p>
                     <ol className="list-decimal ml-8 mb-4">
                        <li>
                           Poskytovatel nenese odpovědnost za jakoukoli újmu či případnou škodu vzniklou v souvislosti s užíváním Služby. Poskytovatel zejména
                           nenese odpovědnost za případnou ztrátu dat, poškození či zničení softwaru či hardwaru Uživatele ani za případný útok na Zařízení
                           vedený jiným Uživatelem.
                        </li>
                        <li>
                           Poskytovatel nenese odpovědnost za obsah informací přenášených prostřednictvím Bezdrátové Wi-Fi sítě, za rozesílaní nevyžádaných
                           zpráv některým z Uživatelů třetím osobám, ani za jiné šíření informací, nakládání s osobními údaji nebo další aktivity Uživatelů v
                           rozporu s platnými právními předpisy či dobrými mravy.
                        </li>
                        <li>
                           Poskytovatel nenese odpovědnost za jakoukoli případnou újmu či škodu vzniklou v důsledku výpadků či omezení funkčnosti nebo
                           výkonnosti Bezdrátové Wi-Fi sítě, přerušení nebo zastavení přenosu dat či jiných poruch připojení k internetu prostřednictvím
                           Bezdrátové Wi-Fi sítě, ani v důsledku omezené výkonnosti jednotlivých částí Bezdrátové Wi-Fi sítě či nedostatečné rychlosti nebo
                           kvality přenosu dat jejím prostřednictvím. Poskytovatel negarantuje jakoukoliv dostupnost, stabilitu, přenosovou rychlost ani jiné
                           vlastnosti Bezdrátové Wi-Fi sítě a Služby.
                        </li>
                     </ol>
                  </li>
                  <li>
                     <p>
                        <strong>8. Komunikace Poskytovatele s Uživateli</strong>
                     </p>
                     <ol className="list-decimal ml-8 mb-4">
                        <li>
                           Případná nezbytná upozornění jsou ze strany Poskytovatele komunikovaná Uživatelům prostřednictvím oznámení. Za oznámení se přitom
                           považuje zpráva, která bude zveřejněná na webových stránkách Poskytovatele praha10.cz, případně na úvodní stránce pro přihlášení do
                           Bezdrátové Wi-Fi sítě.
                        </li>
                        <li>
                           Bezprostřední problémy s využíváním Služby, vyplývající z připojení k Síti, může Uživatel oznámit Poskytovateli prostřednictvím
                           kontaktní e-mailové adresy IT útvaru Poskytovatele: informatika@praha10.cz
                        </li>
                        <li>Uživatel je před oznámením poruchy povinen sám ověřit, zda porucha nespočívá v jeho Zařízení.</li>
                     </ol>
                  </li>
                  <p>
                     <strong>9. Kontaktní místo dle článku 11 nařízení Evropského parlamentu a Rady (EU) 2022/2065 (DSA):</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>
                        Pro účely komunikace s příslušnými orgány a uživateli dle nařízení Evropského parlamentu a Rady (EU) 2022/2065 o digitálních službách
                        (DSA) je kontaktním místem Odbor informatiky městské části Praha 10, e-mail: <a href="mailto:posta@praha10.cz">posta@praha10.cz</a>.
                     </li>
                  </ol>
                  <p>
                     <strong>10. Závěrečná ustanovení</strong>
                  </p>
                  <ol className="list-decimal ml-8 mb-4">
                     <li>
                        Poskytovatel si vyhrazuje právo kdykoliv jednostranně upravit znění těchto Podmínek, a to i bez zaslání informací o provedené úpravě
                        Uživatelům.
                     </li>
                     <li>
                        Ztratí-li některé ustanovení těchto Podmínek platnost a/nebo účinnost, nemá to vliv na platnost a/nebo účinnost zbývajících ustanovení
                        těchto Podmínek.
                     </li>
                     <li>
                        Tyto Podmínky a jakékoli jejich pozdější změny nabývají platnosti a účinnosti dnem jejich zveřejnění prostřednictvím oficiálních
                        komunikačních kanálů Poskytovatele, například na jeho internetových stránkách nebo prostřednictvím rozhraní přístupového portálu.
                     </li>
                     <li>
                        V záležitostech, které nejsou těmito Podmínkami výslovně upraveny, se řídí práva a povinnosti související s poskytováním a užíváním
                        Služby platnými obecně závaznými právními předpisy České republiky.
                     </li>
                  </ol>
                  <p>Tyto Podmínky představují aktualizovanou verzi původních Podmínek ze dne 14. 1. 2025 a nabývají účinnosti dnem 15. 7. 2025.</p>
                  <p className="underline mt-4">
                     <strong>Přehled změn:</strong>
                  </p>
                  <Table className="w-full">
                     <TableHeader>
                        <TableRow>
                           <TableHead>Účinnost od</TableHead>
                           <TableHead>Změny</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        <TableRow>
                           <TableCell>15. 7. 2025</TableCell>
                           <TableCell className="whitespace-normal">
                              Doplněn čl. 9., týkající se kontaktního místa dle článku 11 nařízení Evropského parlamentu a Rady (EU) 2022/2065 (DSA)
                           </TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </ScrollArea>
               <Button variant="outline" className="mx-2" asChild>
                  <a href="TOS.pdf" download>
                     <Download className="w-4 h-4" />
                     Stáhnout
                  </a>
               </Button>
            </DialogContent>
         </Dialog>
      </p>
   );
}
