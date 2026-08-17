import RegisteredGuestsTrendChart from "@/components/admin/dashboard/registered-guests-trend-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePortalRole } from "@/lib/authorization";
import { getDashboardStats } from "@/server/repositories/dashboard-stats/get";

export default async function Page() {
   await requirePortalRole();
   const stats = await getDashboardStats();

   if (stats.serverError) {
      return <div>Chyba: {stats.serverError.message}</div>;
   }

   const data = stats.data;

   if (!data) {
      return <div>Chyba: Nepodařilo se načíst statistiky přehledu.</div>;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Přehled</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
               <CardHeader>
                  <CardTitle>Denní registrace / připojení hostů</CardTitle>
                  <CardDescription>Úspěšně odeslané formuláře hostů za dnešní den</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-bold">{data.dailyRegisteredGuests.toLocaleString()}</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Celkem hostů</CardTitle>
                  <CardDescription>Všichni uživatelé registrovaní přes portálový formulář</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-bold">{data.totalGuestUsers.toLocaleString()}</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Aktivní sítě celkem</CardTitle>
                  <CardDescription>Sítě označené jako aktivní</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-bold">{data.totalActiveNetworks.toLocaleString()}</p>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
               <CardHeader>
                  <CardTitle>Historické srovnání</CardTitle>
                  <CardDescription>Denní registrace / připojení hostů (posledních 30 dní)</CardDescription>
               </CardHeader>
               <CardContent>
                  <RegisteredGuestsTrendChart data={data.dailyTrend} />
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Captive Portal</CardTitle>
                  <CardDescription>Základní informace</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     Captive portál slouží k registraci hostů, evidenci souhlasů a poskytuje správcům přehled o registracích a dostupnosti sítí.
                  </p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
