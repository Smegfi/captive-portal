import { getSmtpConfigurationAction } from "@/server/actions/config-actions";
import SmtpSettings from "@/app/(home)/admin/settings/smtp-settings";
import TestEmail from "@/app/(home)/admin/settings/test-email";
import AccountManagement from "@/app/(home)/admin/settings/account-management";
import { requireAdminRole } from "@/lib/authorization";
import { listAppUsersAction } from "@/server/actions/app-user-actions";

export default async function SettingsPage() {
   await requireAdminRole();

   const smtpConfiguration = await getSmtpConfigurationAction();
   const usersResult = await listAppUsersAction();

   if (smtpConfiguration.serverError) {
      return <div>Error: {smtpConfiguration.serverError.message}</div>;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Nastavení</h1>
         <div className="flex w-full flex-row gap-4">
            <div className="flex-1">
               <SmtpSettings smtpConfiguration={smtpConfiguration.data!} />
            </div>
            <div className="flex-1">
               <TestEmail />
            </div>
         </div>
         {usersResult.serverError ? (
            <div className="text-red-500">{usersResult.serverError.message}</div>
         ) : (
            <AccountManagement users={usersResult.data ?? []} />
         )}
      </div>
   );
}
