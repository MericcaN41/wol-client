/// <reference types="vite/client" />

interface Window {
    NL_PORT?: number;
    NL_TOKEN?: string;
    NL_ARGS?: string[];
}

interface IDevice {
    macAddress: string,
    deviceName: string;
    address: string;
    port: number;
    interval: number;
    uid: string
}