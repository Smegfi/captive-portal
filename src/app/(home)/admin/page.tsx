import RegisteredGuestsTrendChart from "@/components/admin/dashboard/registered-guests-trend-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePortalRole } from "@/lib/authorization";
import { getDashboardStats } from "@/server/repositories/dashboard-stats/get";

export default async function Page() {
   await requirePortalRole();
   const stats = await getDashboardStats();

   if (stats.serverError) {
      return <div>Error: {stats.serverError.message}</div>;
   }

   const data = stats.data;

   if (!data) {
      return <div>Error: Unable to load dashboard statistics.</div>;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Dashboard</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
               <CardHeader>
                  <CardTitle>Daily registered / connected guests</CardTitle>
                  <CardDescription>Successful guest form submissions today</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-bold">{data.dailyRegisteredGuests.toLocaleString()}</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Total guest users</CardTitle>
                  <CardDescription>All-time registered users from portal forms</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-bold">{data.totalGuestUsers.toLocaleString()}</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Total active networks</CardTitle>
                  <CardDescription>Networks with active status flag</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-bold">{data.totalActiveNetworks.toLocaleString()}</p>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
               <CardHeader>
                  <CardTitle>Historical comparison</CardTitle>
                  <CardDescription>Daily registered / connected guests (last 30 days)</CardDescription>
               </CardHeader>
               <CardContent>
                  <RegisteredGuestsTrendChart data={data.dailyTrend} />
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Captive Portal</CardTitle>
                  <CardDescription>Basic information</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     Captive Portal helps onboard guest users, captures consent, and provides administrators with visibility into registrations and network availability.
                  </p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
