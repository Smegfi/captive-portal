import { UAParser } from "ua-parser-js";

const getDeviceInfo = () => {
   const { ua, browser, cpu, device, engine, os } = UAParser(navigator.userAgent);

   console.log("browser", browser);
   console.log("cpu", cpu);
   console.log("device", device);
   console.log("engine", engine);
   console.log("os", os);

   return { ua, browser, cpu, device, engine, os };
};

export function useDevice() {
   const { ua, browser, cpu, device, engine, os } = getDeviceInfo();

   return { ua, browser, cpu, device, engine, os };
}
