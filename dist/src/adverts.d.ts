import type { Advert } from './advertise/index.js';
export interface CachedAdvert {
    service: Advert;
    stop: () => Promise<void>;
}
declare class Adverts {
    private adverts;
    constructor();
    add(advert: CachedAdvert): void;
    remove(advert: CachedAdvert): void;
    clear(): void;
    forEach(fn: (advert: Advert) => void): void;
    stopAll(): Promise<void>;
}
export declare const adverts: Adverts;
export {};
//# sourceMappingURL=adverts.d.ts.map