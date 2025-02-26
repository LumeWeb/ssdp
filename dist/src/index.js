// @ts-nocheck
import { EventEmitter } from 'events';
import { defaultSsdpOptions } from './default-ssdp-options.js';
import { createSockets } from './create-sockets.js';
import { advertise } from './advertise/index.js';
import { discover } from './discover/index.js';
import { notify } from './commands/notify.js';
import { search } from './commands/search.js';
import { searchResponse } from './discover/search-response.js';
import { adverts } from './adverts.js';
import { parseSsdpMessage } from './parse-ssdp-message.js';
import { sendSsdpMessage } from './send-ssdp-message.js';
import { EventIterator } from 'event-iterator';
class SSDPImpl extends EventEmitter {
    constructor(options) {
        super();
        this.options = defaultSsdpOptions(options);
        this.udn = this.options.udn;
        this.signature = this.options.signature;
        this.sockets = [];
        this.abortController = new AbortController();
    }
    async start() {
        // set up UDP sockets listening for SSDP broadcasts
        this.sockets = await createSockets(this, this.abortController.signal);
        // set up protocol listeners
        this.on('transport:incoming-message', parseSsdpMessage.bind(null, this));
        this.on('ssdp:send-message', sendSsdpMessage.bind(null, this));
        this.on('ssdp:m-search', search.bind(null, this));
        this.on('ssdp:notify', notify.bind(null, this));
        this.on('ssdp:search-response', searchResponse.bind(null, this));
    }
    async stop() {
        await adverts.stopAll();
        await Promise.all(this.sockets.map(async (socket) => {
            return await new Promise(resolve => {
                socket.on('close', () => resolve());
                socket.close();
                socket.closed = true;
            });
        }));
        this.abortController.abort();
    }
    async advertise(advert) {
        return await advertise(this, advert);
    }
    async *discover(serviceType) {
        const iterator = new EventIterator(({ push }) => {
            const listener = (service) => {
                if (serviceType != null && service.serviceType !== serviceType) {
                    return;
                }
                push(service);
            };
            this.addListener('service:discover', listener);
            return () => {
                this.removeListener('service:discover', listener);
            };
        });
        discover(this, serviceType);
        yield* iterator;
    }
}
export default async function (options = {}) {
    const ssdp = new SSDPImpl(options);
    if (options.start !== false) {
        await ssdp.start();
    }
    return ssdp;
}
//# sourceMappingURL=index.js.map