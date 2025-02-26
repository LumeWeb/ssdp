/// <reference types="node" />
import { CachedAdvert } from './adverts.js';
import type { Socket } from 'dgram';
export interface NetworkAddress {
    address: string;
    port: number;
}
export interface SSDPSocketOptions {
    type: 'udp4' | 'udp6';
    broadcast: NetworkAddress;
    bind: NetworkAddress;
    maxHops: number;
}
export interface SSDPOptions {
    udn: string;
    signature: string;
    sockets: SSDPSocketOptions[];
    start: boolean;
}
export interface SSDPSocket extends Socket {
    type: 'udp4' | 'udp6';
    closed: boolean;
    options: SSDPSocketOptions;
}
export interface NotfiyMessage {
    LOCATION: string;
    USN: string;
    NT: string;
    NTS: 'ssdp:alive' | 'ssdp:byebye';
    ttl: () => number;
}
export interface SearchMessage {
    LOCATION: string;
    USN: string;
    ST: string;
    ttl: () => number;
}
interface SSDPEvents {
    'transport:incoming-message': (buffer: Buffer, from: NetworkAddress) => void;
    'transport:outgoing-message': (socket: SSDPSocket, buffer: Buffer, to: NetworkAddress) => void;
    'ssdp:send-message': (status: string, headers: Record<string, any>, to?: NetworkAddress) => void;
    'ssdp:m-search': (message: SearchMessage, from: NetworkAddress) => void;
    'ssdp:notify': (message: NotfiyMessage, from: NetworkAddress) => void;
    'ssdp:search-response': (message: SearchMessage, from: NetworkAddress) => void;
    'service:discover': (service: Service) => void;
    'service:update': (service: Service) => void;
    'service:remove': (usn: string) => void;
    'error': (err: Error) => void;
}
export interface Service<DeviceDescription = Record<string, any>> {
    location: URL;
    details: DeviceDescription;
    expires: number;
    serviceType: string;
    uniqueServiceName: string;
}
export interface Advertisment {
    usn: string;
    details: Record<string, any> | (() => Promise<Record<string, any>>);
}
export interface SSDP {
    /**
     * Unique device name - identifies the device and must the same over time for a specific device instance
     */
    udn: string;
    /**
     * A user-agent style string to identify the implementation
     */
    signature: string;
    /**
     * Currently open sockets
     */
    sockets: SSDPSocket[];
    /**
     * Options passed to the constructor
     */
    options: SSDPOptions;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    advertise: (advert: Advertisment) => Promise<CachedAdvert>;
    discover: <Details = Record<string, any>>(serviceType?: string) => AsyncIterable<Service<Details>>;
    on: <U extends keyof SSDPEvents>(event: U, listener: SSDPEvents[U]) => this;
    off: <U extends keyof SSDPEvents>(event: U, listener: SSDPEvents[U]) => this;
    once: <U extends keyof SSDPEvents>(event: U, listener: SSDPEvents[U]) => this;
    emit: <U extends keyof SSDPEvents>(event: U, ...args: Parameters<SSDPEvents[U]>) => boolean;
}
export default function (options?: Partial<SSDPOptions>): Promise<SSDP>;
export {};
//# sourceMappingURL=index.d.ts.map