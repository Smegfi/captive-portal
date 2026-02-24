import { getSmtpConfigurationAction } from "@/server/actions/config-actions";
import SmtpSettings from "@/app/(home)/admin/settings/smtp-settings";
import TestEmail from "@/app/(home)/admin/settings/test-email";

export default async function SettingsPage() {
   const smtpConfiguration = await getSmtpConfigurationAction();
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
      </div>
   );
}
