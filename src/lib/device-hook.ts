import { UAParser } from "ua-parser-js";

const getDeviceInfo = () => {
   const { ua, browser, cpu, device, engine, os } = UAParser(window.navigator.userAgent);

   return { ua, browser, cpu, device, engine, os };
};

export function useDevice() {
   const { ua, browser, cpu, device, engine, os } = getDeviceInfo();

   return { ua, browser, cpu, device, engine, os };
}
