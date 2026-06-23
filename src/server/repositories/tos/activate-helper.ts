import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { eq, max } from "drizzle-orm";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Aktivuje daný TOS dokument v rámci transakce.
 *
 * - aktuálně aktivnímu dokumentu nastaví `activeTo` (archivace) a deaktivuje ho,
 * - cílovému dokumentu nastaví `activeFrom` a přiřadí další globální číslo verze.
 *
 * Dokument, který již byl jednou aktivován (`activeFrom` není null), nelze
 * aktivovat znovu – v takovém případě je nutné vytvořit kopii.
 */
export async function activateTosWithinTx(tx: DbTransaction, id: number, now: Date = new Date()) {
   const target = await tx.query.tos.findFirst({ where: eq(tos.id, id) });

   if (!target) {
      throw new Error("TOS dokument nebyl nalezen");
   }

   if (target.isActive) {
      return target;
   }

   if (target.activeFrom != null) {
      throw new Error("Tento dokument již byl jednou aktivován a nelze jej znovu aktivovat. Vytvořte jeho kopii.");
   }

   await tx.update(tos).set({ isActive: false, activeTo: now }).where(eq(tos.isActive, true));

   const [{ value: maxVersion }] = await tx.select({ value: max(tos.versionNumber) }).from(tos);
   const nextVersion = (maxVersion ?? 0) + 1;

   const updated = await tx.update(tos).set({ isActive: true, activeFrom: now, versionNumber: nextVersion }).where(eq(tos.id, id)).returning();

   return updated[0] ?? null;
}

/**
 * Vrátí číslo verze, které by dostal příští aktivovaný dokument.
 */
export async function getNextTosVersionNumber() {
   const [{ value: maxVersion }] = await db.select({ value: max(tos.versionNumber) }).from(tos);
   return (maxVersion ?? 0) + 1;
}
