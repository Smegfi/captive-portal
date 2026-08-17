import { readFileSync, writeFileSync } from "fs";
import { smtpConfigurationSchema } from "@/server/repositories/configuration/schema";

interface StoredConfigFile {
   smtp: unknown;
}

export function readStoredConfig(): StoredConfigFile {
   return JSON.parse(readFileSync("src/server/configuration/config.json", "utf8")) as StoredConfigFile;
}

export function writeStoredConfig(config: StoredConfigFile) {
   writeFileSync("src/server/configuration/config.json", JSON.stringify(config, null, 2));
}

export function getStoredSmtpConfiguration() {
   const config = readStoredConfig();
   const smtp = {
      ...(config.smtp as Record<string, unknown>),
      anonymousAuth: (config.smtp as { anonymousAuth?: boolean }).anonymousAuth ?? false,
   };

   return smtpConfigurationSchema.parse(smtp);
}
